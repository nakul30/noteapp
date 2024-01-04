require("dotenv").config();
const express = require("express"); 
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
// const cookieParser = require('cookie-parser');  
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const db = require("./config/mongoose"); 
const session = require("express-session"); 
const passport = require("passport"); 
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, 
  delayMs: 500, 
});
app.use(bodyParser());

app.use(express.static("./assets"));
const store = new MongoStore({
  mongoUrl: process.env.MONGODB_URL, // Replace with your MongoDB connection URL
  mongooseConnection: db,
  autoRemove: "disabled",
});
app.use(
  session({
    name: "Noteapp",
    secret: process.env.CLIENT_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", require("./routes"), limiter);
app.listen(port, function (err) {
  if (err) {
    console.log("FATAL ERR AT INDEX FILE");
  } else {
    console.log(`function working at port ${port} `);
  }
});
