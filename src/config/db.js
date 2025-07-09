const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    const dbURL = process.env.DB_URL;

    if (!dbURL) {
        console.error("DB_URL is not defined in .env file");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(dbURL);

        if (conn.connection.readyState === 1) {
            console.log("Database connected successfully");
        }

        return conn;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
};
