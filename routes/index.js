const express = require('express');
const router = express() ; 
console.log("ROUTER DEPLOYED ") ; 
router.get('/', (req, res) => {
    res.redirect('/api/auth/login') ; 
});
router.use('/api/auth' , require('./auth'));
router.use('/api/notes' , require('./notes'));
router.use('/api/search',require('./search')) ;
module.exports = router ; 