const User = require("../models/user");

module.exports.create = async function (req, res) {
  try {
    // Validate request body
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.confirm_password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // TODO ---->Consider hashing the password before saving
    });

    // Send success response
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.createsession = async function (req, res) {
    // console.log(req) ;
  try {
    res.status(201).json({ message: "Session created successfully" });
    // res.setHeader("Location", "/notes");
    console.log("Sent to Notes Page")
    res.end(); // End the response to prevent further processing

  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    try {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Failed to destroy session' });
        res.end();
      }
 
      res.json({ message: 'Session destroyed successfully' });
    } catch (error) {
      console.error('Error in destroySession:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};
