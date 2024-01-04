require('dotenv').config();
const mongoose = require('mongoose'); //library for MongoDB,more organized way to interact with MongoDB.
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db; 
