const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../model/Profiles");
const User = require("../../model/User");
// const mongoose = require('mongoose');
const { check, validationResult } = require("express-validator");

// @route  DELETE api/profile/:profile_id
// @desc   Get Profile by user ID
// @access Public
router.delete("/", auth, async (req, res) => {
  try {
    // remove @todo - remove users posts

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

// @route  GET api/profile/me
// @desc   Get current user profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    
    console.log(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// @route  POST api/profile
// @desc   Create or update user profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
      } = req.body;

      // Build profile object
      const profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(",").map((skill) => skill.trim());
      }
      // Build Social Object
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (instagram) profileFields.social.instagram = instagram;
      if (linkedin) profileFields.social.linkedin = linkedin;

      try {
        let profile = await Profile.findOne({ user: req.user.id });
        console.log(profile);
        if (profile) {
          await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  GET api/profile
// @desc   Create or update user profile
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    await res.status(200).json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/profile/user/:user_id
// @desc   Get Profile by user ID
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    await res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    res.status(500).send("Server Error");
  }
});


// @route  PUT api/profile/experience
// @desc   Add Pofile experience
// @access Private 
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    } 
    const {title, company, location, from, to, current, description} = req.body;
    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try{
        const profile = await Profile.findOne({user: req.user.id});
        
        profile.experience.unshift(newExperience);
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
  }
);


// @route  DELETE api/experience/:exp_id
// @desc   Delete Experience
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    // Grab profile
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.experience.map(item=> item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();

    return res.json({ msg: "Expereince Deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});


// @route  PUT api/profile/education
// @desc   Add Pofile education
// @access Private 
router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("from", "from Date is required").not().isEmpty(),
      check("fieldOfStudy", "Field Of Study is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {school, degree, from, fieldOfStudy, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      from,
      fieldOfStudy,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  }
);


// @route  DELETE api/education/:edu_id
// @desc   Delete By Education Id
// @access Private
router.delete("/experience/:edu_id", auth, async (req, res) => {
  try {
    // Grab profile
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();

    return res.json({ msg: "Education Deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
