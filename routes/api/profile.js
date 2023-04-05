const express =require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../model/Profiles');
const User = require("../../model/User");
// const mongoose = require('mongoose');
const { check, validationResult } = require("express-validator");
// @route  GET api/profile/me
// @desc   Get current user profile
// @access Private
router.get('/me', auth, (req, res)=> {
    try{
        const userId = req.user.id;
        const profile = Profile.findById({ user: userId }).populate('user', ['name', 'avatar']);
        if (!profile){
            return res.status(400).json({msg: 'There is no profile for this user'})
        } 
        res.status(200).json(profile);
    } catch(error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
    
})

// @route  POST api/profile
// @desc   Create or update user profile 
// @access Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res)=> {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
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
            linkedin
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill=> skill.trim());
        }
        // Build Social Object
        profileFields.social= {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try{
            let profile = await Profile.findOne({user: req.user.id});
            console.log(profile);
            if(profile){
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
        } catch(error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
        res.send("HEre is the response")
    } catch(error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
    
})

// @route  GET api/profile
// @desc   Create or update user profile 
// @access Public
router.get("/", async (req, res) => {
    try{
        const profiles = await Profile.find().populate('user', ["name", "avatar"]);
        await res.status(200).json(profiles);
    } catch(error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
    
});

// @route  GET api/profile/user/:user_id
// @desc   Get Profile by user ID
// @access Public
router.get("/user/:user_id", async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ["name", "avatar"]);
        if (!profile) {
            return res.status(404).json({msg: 'There is no profile for this user'})
        } 
        await res.status(200).json(profile);
    } catch(error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
    
});


module.exports = router;