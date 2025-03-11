const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const { promisify } = require("util");
// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

  let token;
  if (
    req.header.authorization &&
    req.header.authorization.startsWith("Bearer")
  ) {
    token = req.header.authorization.split(" ")[1];
  }
  //In Prod - Brower || Postman - Cookie
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }


  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ErrorHandler(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ErrorHandler("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});

// Handling users roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to acccess this resource`,
          403
        )
      );
    }
    next();
  };
};
