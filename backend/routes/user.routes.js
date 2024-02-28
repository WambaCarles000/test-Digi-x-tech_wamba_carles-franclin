const express = require("express");
const router = express.Router();
const { updateInfo} = require("../controllers/user.controller.js");





router.post('/update-info',updateInfo)


module.exports = router;
