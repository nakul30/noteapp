const mongoose = require('mongoose'); //library for MongoDB,more organized way to interact with MongoDB.
mongoose.connect('mongodb://127.0.0.1:27017/Noteappjanuary');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db; 
