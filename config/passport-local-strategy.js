const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
//authenticaiton using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // From schema
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user || user.password != password) {
          // Call a password validation method
          return done(null, false, { message: "Invalid email or password" }); // Provide feedback
        }

        return done(null, user);
      } catch (err) {
        console.error("Error in finding user -- Passport", err);
        return done(err);
      }
    }
  )
);

//cerealise and decerialise function

// serialise the user to decide which key to kept in cookie

passport.serializeUser((user, done) => {
  try {
    console.log(`Serializing user ${user.id}`);
    done(null, user.id);
  } catch (err) {
    console.error("Error serializing user:", err);
    done(err);
  }
});

// // whichi identi is in the user base so decreralise
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    if (user) {
      console.log(`Deserializing user ${user.id}`);
      return done(null, user);
    } else {
      console.warn(`User not found with ID: ${id}`);
      return done(null, false);
    }
  } catch (err) {
    console.error("Error deserializing user:", err);
    return done(err);
  }
});

// check if user is authenticated
passport.checkAuthentication = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      // console.log("Passed PLS")
      next();
    } else {
      // User is not authenticated
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error in checkAuthentication:", error);
    res.status(500).json({ error: "Internal server error PLS" });
  }
};

passport.dontload = async function (req, res, next) {
  try {
    console.log("Error after dont load ");
    if (req.isAuthenticated()) {
      res.status(401).json({ error: "Already logged in" });
    } else {
      return next();
    }
  } catch (err) {
    console.error("Error in loading middleware ");
    res.status(500).json({ error: "Internal server Error" });
  }
};
// //chekc if user is signed in--> canvceled use
passport.setAuthenticateduser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("ERR") ;
    res.locals.user = req.user;
    // next() ;
  }
  next();
};
module.exports = passport;
