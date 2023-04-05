const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get("/", (req, res) => res.send("user route"));


// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more charaters").isLength(6),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    // see if users exists
    
    // Get users Gravatar

    // Encrypt password

    // Return jsonweb token

    res.send("user route");
  }
);
module.exports = router;
