const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const APIFeatures = require("../utils/apiFeatures");

// Create new product   =>   /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    let images = []

    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get("host")}`;
    }

    if (req.files.length > 0) {
        req.files.forEach((file) => {
            let url = `${BASE_URL}/uploads/products/${file.originalname}`
            images.push({ image: url })
        })
    }
    req.body.images = images

    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        status: "Success",
        product,
    });
});

// get all products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 12;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage);

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    // apiFeatures.pagination(resPerPage)
    // products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products,
    });
});

// get single product => api/v1/product/:id
exports.getSingleProducts = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Admin

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];

    if (req.body.imagesCleared === "false") {
        const product = await Product.findById(req.params.id);
        if (product) {
            images = product.images;
        }
    }

    if (req.files.length > 0) {
        req.files.forEach((file) => {
            let url = `${process.env.BACKEND_URL}/uploads/products/${file.originalname}`;
            images.push({ image: url });
        });
    }

    // Modify req.body before updating
    req.body.images = images;

    // Now update the product with the modified req.body
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        return next(new ErrorHandler("Product not Found++", 404));
    }

    res.status(200).json({
        status: "Success",
        message: "Successfully Updated..",
        product,
    });
});

// delete product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const action = await Product.findByIdAndDelete(req.params.id);

    if (!action) {
        return next(new ErrorHandler("Product not Found++", 404));
    }

    res.status(200).json({
        status: "Success",
        message: "SuccessFully Deleted..",
    });
});

// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body)
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const name = req.user.name

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
                review.name = name
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email')
    res.status(200).json({
        status: "Success",
        reviews: product.reviews,

    });
});

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    console.log(req.query.productId)
    console.log(req.query.id)
    const product = await Product.findById(req.query.productId);

    //Remove the Review using Filter Function
    const reviews = product.reviews.filter((rev) => {
        return rev._id.toString() !== req.query.id.toString();
    });
    //Find the numOfReviews using len() from reviews because it is a Array
    const numOfReviews = reviews.length;
    //Find the Review Average
    let ratings =
        product.reviews.reduce((acc, rev) => {
            return rev.rating + acc;
        }, 0) / numOfReviews;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            numOfReviews,
            ratings,
        },
        { new: true, validateBeforeSave: true }
    );
    res.status(200).json({
        status: "Success",
        message: "Review Successfully Deleted",
        reviews: product.reviews,
    });
});
