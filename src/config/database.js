const mongoose = require('mongoose');
require('dotenv').config();

const URL = process.env.MONGODB_URL;
const connectDB = async () => await mongoose.connect(URL);

module.exports = { connectDB }

