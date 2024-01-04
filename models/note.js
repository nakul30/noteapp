const mongoose = require('mongoose');
const notesschema = new mongoose.Schema({
    nheading:{
        type:String, 
        required : true
    },
    ncontent:{
        type: String,
        required :true
    },
    nuser :{
        type:  mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required:true 
    }
}, {timestamps: true 
});

const Note = mongoose.model('Note' , notesschema );
module.exports = Note ;