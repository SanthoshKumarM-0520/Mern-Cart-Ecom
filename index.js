const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config("./config/config.env");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
const cors = require('cors')

const auth = require("./routes/auth");
const products = require("./routes/product");
const payment = require("./routes/payment");
const order = require("./routes/order");
const errorMiddleware = require("./middleware/error");


app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(`${__dirname}/uploads`));



app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));



// import all routes

app.use("/api/v1", auth);
app.use("/api/v1", products);
app.use("/api/v1", payment);
app.use("/api/v1", order);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

// connecting to database
connectDatabase();

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/", (req, res) => {
    res.send("App is running.");
});

// Middleware to handle error
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
