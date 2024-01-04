const express = require("express");
const { authorize } = require("passport");
const router = express();
const passport = require("passport");
const authcontroller = require("../controllers/auth_controller");

router.post(
  "/login",
  passport.authenticate("local"),
  authcontroller.createsession
);
router.post("/signup", authcontroller.create);
router.get("/logout", authcontroller.destroySession);
module.exports = router;
