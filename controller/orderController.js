const Order = require("../models/order");
const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const updateStock = async (productID, orderQty) => {
    const product = await Product.findById(productID);
    product.stock -= orderQty;
    await product.save({ validateBeforeSave: false });
};

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(200).json({
        success: true,
        order,
    });
});

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders,
    });
});

// Get single order   =>   /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// admin section

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    console.log("--------")
    console.log(req.body)
    console.log("--------")
    const order = await Order.findById(req.params.id);

    if (order.orderStatus == "Delivered") {
        return next(new ErrorHandler("Order is already Delivered", 400));
    }

    //Update the Product Stock According to Ordered Items
    order.orderItems.forEach(async (orderItem) => {
        await updateStock(orderItem.product, orderItem.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        status: "Success",
        order,
    });
});

// Delete order   =>   /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});
