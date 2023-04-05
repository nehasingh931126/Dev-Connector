const express =require('express');
const router = express.Router();

// @route  GET api/profile/me
// @desc   Get current user profile
// @access Public
router.get('/', (req, res)=> {
    res.status(200).send("Api profile working")
})

router.get("/", (req, res) => {
  res.status(200).send("Api profile working");
});


module.exports = router;