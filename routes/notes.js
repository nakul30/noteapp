const express = require('express');
const router = express() ; 
const passport = require('passport') ; 
const notecontroller = require('../controllers/notes_controller')

router.get('/', passport.checkAuthentication,notecontroller.notesload);
router.get('/:id', passport.checkAuthentication,notecontroller.onenoteload);
router.post('/',passport.checkAuthentication , notecontroller.createnote);
// router.post('/:id/share',passport .checkAuthentication,notecontroller.sharenote) ;
router.put('/:id',passport.checkAuthentication,notecontroller.updatenote) ;
router.delete('/:id',passport.checkAuthentication,notecontroller.deletenode);

module.exports = router ; 