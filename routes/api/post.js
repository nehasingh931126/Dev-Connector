const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../model/Post");
const User = require("../../model/User");
const router = express.Router();

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post("/", [auth, [
    check("text", "title is requried").not().isEmpty()
]], async (req, res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()});
  }
  try{
    const user = await User.findById(req.user.id).select('-password');
  const newPost = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  };
  const newPostObject = new Post(newPost);
  await newPostObject.save();
  } catch(error) {
    console.log(error);
    res.status(500).send('server error')
  }
});



// @route   GET api/posts
// @desc    Get Posts
// @access  Private
router.get("/", [auth], async (req, res) =>{
  try{
    const post = await User.find().sort({date: -1});
    res.status(200).json(post);
  await newPostObject.save();
  } catch(error) {
    console.log(error);
    res.status(500).send('server error')
  }
});

// @route   GET api/posts/:id
// @desc    Get Post by ID
// @access  Private
router.get("/", auth, async (req, res) =>{
  try{
    const post = await User.findById(req.params.id);
    if(!post) {
        return res.status(404).json({msg: 'post not found'});
    }
    res.status(200).json(post);
  await newPostObject.save();
  } catch(error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: "post not found" });
    }
    console.log(error);
    res.status(500).send('server error')
  }
});


// @route   DELETE api/posts
// @desc    Delete A post
// @access  Private
router.delete("/", auth, async (req, res) =>{
  try{
    const post = await User.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }

    if(post.user.toString() !==  req.user.id){
        return res.status(402).send({msg: 'User not authorized'});
    }

    await post.remove();

    res.json({msg: 'post removed'});
  await newPostObject.save();
  } catch(error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    console.log(error);
    res.status(500).send('server error')
  }
});

// @route PUT api/posts/like/:id
// @desc like a post
// @access Private
router.put('/like/:id', auth, async (req, res)=> {
    try{
        const post = await Post.findById(req.params.id);
        
        // check if the post has already been liked
        if(post.likes.filter(like=> like.user.toString() ===  req.user.id).length > 0) {
            return res.status(400).json({msg: 'Post already liked'});
        }
        post.likes.unshift({user: req.user.id});

        await post.save();
    } catch(error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});


// @route PUT api/posts/unlike/:id
// @desc unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res)=> {
  try {
    const post = await Post.findById(req.param.id);

    // check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    return res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }

  // @route   POST api/posts
  // @desc    Create a post
  // @access  Private
  router.post(
    "/comment/:id",
    [auth, [check("text", "text is requried").not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const user = await User.findById(req.user.id).select("-password");
        const post = await Post.findById(req.params.id);

        const newComment = {
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
        };
        post.comments.unshift(newComment)
        await post.save();
        res.json(post.comments);
      } catch (error) {
        console.log(error);
        res.status(500).send("server error");
      }
    }
  );
}); 

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a post
//@access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res)=>{
    try {
        await Post.findById(req.params.id);

        // Pull out comment 
        const comment = post.comments.find(
          (comment) => comment.id === req.params.comment_id
        );

        if(!comment) {
            return res.status(404).json({msg: 'Comment does not exists'});
        }

        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'})
        }

        const removeIndex = post.comments
          .map((like) => like.user.toString())
          .indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save(); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
})
module.exports = router;


