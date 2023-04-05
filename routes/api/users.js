const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require("express-validator");
const User = require('../../model/User');

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // see if users exists
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }
      res.send("user route");
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }

    // Get users Gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    // Encrypt password

    // Return jsonweb token
  }
);
module.exports = router;
