var express = require('express');
var router = express.Router();
const { faker } = require('@faker-js/faker');
const {userModel} = require('../models/user');

router.get('/signin', function(req,res){
  res.render("login", { title: 'Express', message: req.flash('message') ? req.flash('message') : ""});
})
router.get('/signup', function(req,res){
  res.render("signup", { title: 'Express', message: req.flash('message') ? req.flash('message') : ""});
})


/* POST user . */
router.post('/signup', async function(req, res, next) {
  const user = await userModel.findOne({email: req.body.email});
  if(user){
    req.flash('message', 'Vous avez deja un adresse mail veillez vous connecter');
    res.redirect("/auth/signup")
  }else{
    const newUser = new userModel({
      ...req.body,
      avatar: faker.image.avatar(),
    })
    const savedUser = await newUser.save();
    req.session.user = savedUser.email;
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
      // req.session.message = "Votre mot de passe est incorrect, veillez ressayer un autre !!!"
      req.flash('message', 'Votre mot de passe est incorrect !!!');
      res.redirect("/auth/signin");
    }
  }else{
    req.flash('message', 'Votre adresse mail est est incorrect !!!!');
    res.redirect("/auth/signin");
  }
  // res.render("signup")
});


// router.get('/flash', (req, res) => {
//   req.flash('success', `You've been successfully redirected to the Message route!`)
//   res.redirect('/auth/message')
// })

// router.get('/message', (req, res) => {
//   res.send(req.flash('success'))
// })

module.exports = router;
