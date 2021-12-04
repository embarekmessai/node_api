const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const cors = require('cors');
const authRoute = require('./routes/auth');

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    });

app.use(cors());
app.use(express.json());

app.use("/api/v1", authRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
});