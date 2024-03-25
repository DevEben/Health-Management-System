const mongoose = require('mongoose');
require('dotenv').config();

const db = process.env.database;

mongoose.connect(db).then(() => {
    console.log('Connected to the database successfully');
}).catch((error) => {
    console.log(error.message);
})
