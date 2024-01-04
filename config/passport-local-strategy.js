const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
//authenticaiton using passport
passport.use(
    new LocalStrategy({
      usernameField: "email", // From schema
    }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email }); // Use object shorthand for brevity
  
        if (!user || user.password != password) { // Call a password validation method
          return done(null, false, { message: "Invalid email or password" }); // Provide feedback
        }
  
        return done(null, user);
      } catch (err) {
        console.error("Error in finding user -- Passport", err);
        return done(err); // Pass the error for centralized handling
      }
    })
  );
  
 
//cerealise and decerialise function

// serialise the user to decide which key to kept in cookie

passport.serializeUser((user, done) => {
    try {
      // Log user information for debugging or auditing (optional)
      console.log(`Serializing user ${user.id}`); // Use template literal for clarity
  
      // Store only the user ID in the session for security and efficiency
      done(null, user.id);
    } catch (err) {
      console.error('Error serializing user:', err);
      done(err); // Pass the error for centralized handling
    }
  });
  

// // whichi identi is in the user base so decreralise
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Use `const` for non-reassigned variables
  
      if (user) {
        // Log user information for debugging or auditing (optional)
        console.log(`Deserializing user ${user.id}`); // Use template literal for clarity
  
        // Return the complete user object for backend operations
        return done(null, user);
      } else {
        // Handle the case where no user is found
        console.warn(`User not found with ID: ${id}`);
        return done(null, false); // Indicate no user found
      }
    } catch (err) {
      console.error('Error deserializing user:', err);
      return done(err); // Pass the error for centralized handling
    }
  });
  
// check if user is authenticated 
passport.checkAuthentication = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      // console.log("Passed PLS")
      next(); // Proceed to the next middleware or route handler
    } else {
      // User is not authenticated
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error in checkAuthentication:', error);
    res.status(500).json({ error: 'Internal server error PLS' });
  }
};

passport.dontload = async function( req , res , next ){
    try{
        if ( req.isAuthenticated()){
            return res.redirect('/products') ;
        }
        return next() ;
    }
    catch( err ){
        console.log( "ERR APPERA") ;
    }
}
// //chekc if user is signed in
passport.setAuthenticateduser = function( req , res, next  ){
    if ( req.isAuthenticated()){
        // console.log("ERR") ;
        //whenevere user is signed in we get its id in req.user as wwe are using user now transfer to response locals for the views
        res.locals.user = req.user ;
        // next() ;
    }
    next() ;
}
module.exports = passport;
