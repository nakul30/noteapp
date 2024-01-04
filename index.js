const express = require('express') ; //express module in a Node.js application
// const cookieParser = require('cookie-parser');   //middleware required      //during signup page 
const bodyParser = require('body-parser') ;   
const app = express() ;   
const port = 8000;   
const db = require('./config/mongoose') ;  // get mongoose file 
const session = require('express-session') ; // used to manage session 
const passport  = require('passport') ; // libraire used for authentication purpose
const passportLocal = require('./config/passport-local-strategy') ; 
const MongoStore = require('connect-mongo') ;
app.use(bodyParser()) ; 

app.use(express.static('./assets')) ; 
const store = new  MongoStore({
    mongoUrl: 'mongodb://127.0.0.1:27017/Noteappjanuary', // Replace with your MongoDB connection URL
    mongooseConnection: db,
    autoRemove: 'disabled',
  });
app.use(session({
    name: 'Noteapp' ,
    //TODO -- chane the encrptyoi before final depouyemnt 
    secret: 'blahsomething'  , 
    saveUninitialized : false , 
    resave: false , 
    cookie : {
        maxAge: (1000*60*100) 
    } , 
    store : store  , 
})
); 
app.use(passport.initialize()) ; 
app.use(passport.session()) ; 
app.use('/' , require('./routes')) ; 
app.listen(port ,function( err ){
    if ( err ){
        console.log("FATAL ERR AT INDEX FILE") ;
    }
    else{
        console.log(`function working at port ${port} `);
    } 
})

