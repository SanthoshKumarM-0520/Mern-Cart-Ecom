const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    logout,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser,
} = require("../controller/authController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../uploads/user`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/signin", upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, upload.single("avatar"), updateProfile);

// admin
router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
