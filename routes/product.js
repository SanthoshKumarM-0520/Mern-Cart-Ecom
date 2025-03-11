const express = require("express");
const {
    newProduct,
    getProducts,
    getSingleProducts,
    getAdminProducts,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
} = require("../controller/productController");
const multer = require("multer");
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${__dirname}/../uploads/products`);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});


const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProducts);
router
    .route("/admin/products/new")
    .post(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array('images'),
        (req, res, next) => {
            console.log("Uploaded files:", req.files); // Debugging line
            newProduct(req, res, next);
        }
    );
router.route("/admin/products").get(getAdminProducts);
router
    .route("/admin/product/:id")
    .put(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images"),
        updateProduct
    )
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
// product reviews

router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
