const express = require("express");
const router = express();
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
console.log("ROUTER DEPLOYED ");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, 
  message: "Too many requests from this IP, please try again later.",
});
router.use("/api", limiter);
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,
});
router.use("/api", speedLimiter);
router.get("/", (req, res) => {
  res.redirect("/api/auth/login");
});
router.use("/api/auth", require("./auth"));
router.use("/api/notes", require("./notes"));
router.use("/api/search", require("./search"));
module.exports = router;
