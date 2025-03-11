const products = require("./products");
const Product = require("../models/product");
const dotenv = require("dotenv");
const connect_DB = require("../config/database");

dotenv.config({ path: "../config/config.env" });
connect_DB();

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log("DataBase Cleared..");
        await Product.insertMany(products);
        console.log("DataBase Inserted..");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

seedProducts();
