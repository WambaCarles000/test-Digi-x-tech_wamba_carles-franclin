const express = require("express");
const router = express.Router();
const {loginForm,login,confirmUser, forgotPasswordForm,forgotPassword,resetPasswordLink,resetPassword, register} = require("../controllers/user.controller.js");




//login
router.get("/login",loginForm);
router.post("/login",login);

//confirm
router.get('/confirm', confirmUser);

// Route pour le formulaire "Mot de passe oublié"
router.get('/forgot-password', forgotPasswordForm);

//manager controler
router.post('/forgot-password-sucess', forgotPassword);


router.get('/reset-password', resetPassword);

//manager controler
// router.post('/reset-password', resetPassword);

//Home//Roads's setting
router.post('/registration',register)
  
module.exports = router;
