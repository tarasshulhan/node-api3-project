const express = require('express');
const {
  validateUserId,
  validateUser,
  validatePost,
  errorHandling,
} = require('../middleware/middleware')
const Users = require('../users/users-model')
const Posts = require('../posts/posts-model');

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  Users.insert({name: req.name})
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)

});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  Users.update(req.params.id, {name: req.name})
    .then(() => {
      return Users.getById(req.params.id)
    })
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  try{
    await Users.remove(req.params.id)
    res.json(req.user)
  } catch (err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try{
    const posts =  await Users.getUserPosts(req.params.id)
    res.json(posts)
  } catch (err){
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  try{
    const post = await Posts.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(post)
  }catch (err){
    next(err)
  }
});

router.use(errorHandling);

module.exports = router;
