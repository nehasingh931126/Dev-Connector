const express =require('express');
const router = express.Router();

// @route  GET api/posts
// @desc   Test route
// @access Public
router.get('/', (req, res)=> {
    res.status(200).send("Api profile working")
})


module.exports = router;