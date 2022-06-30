var express = require('express');
var router = express.Router();
const {userModel} = require('../models/user');

/* POST user . */
router.post('/sign-up', async function(req, res, next) {
  const user = await userModel.findOne({email: req.body.email});
  if(user){
    res.redirect("/auth")
  }else{
    const newUser = new userModel({
      ...req.body
    })
    const savedUser = newUser.save();
    req.session.user = savedUser.email;
    console.log(req.session.user);
    res.redirect("/");
  }
});

/* Login user listing. */
router.post('/login', async function(req, res, next) {
  const user = await userModel.findOne({email: req.body.email});
  if(user){
    if(user.password === req.body.password){
      req.session.user = user.email;
      res.redirect("/")
    }else{
      res.redirect("/auth");
    }
  }else{
    res.redirect("/auth");
  }
  console.log(req.session.user)
});

module.exports = router;
