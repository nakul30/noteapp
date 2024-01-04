const express = require('express');
const router = express() ; 
const passport =require('passport');
const searchcontroller = require('../controllers/search_controller') ; 

router.get('/', passport.checkAuthentication,searchcontroller.searchquery );
module.exports = router ;  