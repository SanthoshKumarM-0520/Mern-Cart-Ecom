const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

// Register a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get("host")}`;
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar,
    });
    sendToken(user, 200, res);
});

// Login User  =>  /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
});

// Forgot Password   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    let BASE_URL = process.env.FRONTEND_URL;

    // Create reset password url
    const resetURL = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `Forget your password? Submit a PATCH req with your new password ans passwordconfirm to : ${resetURL}.\nIf you did'nt forget your password , please ignore this email.!`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 30 min)",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Password reset token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});

// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Update / Change password   =>  /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body)
    const user = await User.findById(req.user.id).select("+password");

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler("Old password is incorrect"));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    let newUserData = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone
    };




    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get("host")}`;
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
        newUserData = { ...newUserData, avatar };

    }


    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// Logout user   =>   /api/v1/logout
exports.logout = (req, res) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success", message: "Logout Successfull" });
}

// Admin Routes

// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not found with id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User Not Found", 401));
    }
    await user.deleteOne();
    res.status(200).json({
        status: "success",
        message: "User Deleted Successfully",
    });
});
