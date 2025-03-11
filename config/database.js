const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASSWORD);


const connectDatabase = async () => {
    await mongoose.connect(DB).then(() => {
        console.log("DB Connected Successfully..📁✅");
    });
};

module.exports = connectDatabase;
