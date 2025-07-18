const express = require("express");
const router = express.Router();
const { registerHR, loginHR } = require("../controllers/auth.controller");

router.post("/register-hr", registerHR);
router.post("/login-hr", loginHR); 


module.exports = router;
