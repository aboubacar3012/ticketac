var express = require('express');
var router = express.Router();
const {userModel} = require('../models/user');
/* GET auth page. */
router.get('/', function(req, res, next) {
  res.render('auth', { title: 'Express', message: req.flash('message') ? req.flash('message') : "" });
});

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
      // req.session.message = "Votre mot de passe est incorrect, veillez ressayer un autre !!!"
      req.flash('message', 'Votre mot de passe est incorrect, veillez ressayer un autre !!!');
      res.redirect("/auth");
    }
  }else{
    req.flash('message', 'Votre adresse mail est est incorrect !!!!');
    res.redirect("/auth");
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
