const mongoose = require('mongoose');
const dotenv = require("dotenv");
const mongoURI = process.env.DB_URL;

mongoose.connect(mongoURI,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true });

module.exports = mongoose;