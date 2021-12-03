const Users = require('../users/users-model')
const Posts = require('../posts/posts-model')

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
}

async function validateUserId(req, res, next) {
  try{
    const user = await Users.getById(req.params.id);
    if(user){
      req.user = user;
      next();
    }else{
      next({ status: 404, message: "user not found" })
    }
  }catch(error){
    next(error);
}
}

function validateUser(req, res, next) {
    if (!req.body.name || !req.body.name.trim()) {
      next({ status: 400, message: "missing required name field" });
    } else {
      next();
    }
  
}

function validatePost(req, res, next) {
  if (!req.body.text || !req.body.text.trim()) {
    next({ status: 400, message: "missing required text field" });
  } else {
    next();
  }
}

function errorHandling(err, req, res, next) { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
}

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
  errorHandling
}
