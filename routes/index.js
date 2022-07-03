var express = require('express');
var router = express.Router();
var {journeyModel}= require('../models/journey')
const {userModel} = require('../models/user');
const stripe = require('stripe')('sk_test_tMh5UoZZAh1KzBHpSVXZanJk00hfDJaIX1')


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2022-07-03","2022-07-04","2022-07-05","2022-07-03","2022-07-04","2022-07-05"]



/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    res.render('index', { title: 'Express' });
  }else{
    res.redirect("/auth/signin")
  }
});
/* GET not-found page. */
router.get('/not-found', function(req, res, next) {
  if(req.session.user){
    res.render('not-found', { title: 'Express' });
  }else{
    res.redirect("/auth/signin")
  }
});
/* GET cart page. */
router.get('/cart', async function(req, res, next) {
	if(req.session.user && req.session.journeys){
    res.render('cart', { journeys: req.session.journeys});
  }else if(req.session.user){
    res.redirect("/")
  }else{
    res.redirect("/auth/signin")
  }
});

/* GET cart page. */
router.get('/addjourney', async function(req, res, next) {
  if(!req.session.journeys){
    req.session.journeys = []
  }
  const journey = await journeyModel.findById(req.query.id);
  if(journey){
    req.session.journeys.push(journey);
  }
  
  res.redirect("/cart")
  });

router.get('/validate-cart',async function(req, res){
  if(req.session.user){
    console.log(req.session.journeys)
    const user= await userModel.findOne({email:req.session.user}).populate('journeys');
    req.session.journeys.map((el) => user.journeys.push(el._id));
    // user.journeys.push(req.session.journeys)
    await user.save();
    req.session.journeys = []
  }
  res.redirect("/success")
})

router.post('/create-checkout-session', async (req, res) => {
  const carts = [];
  if(req.session.user || req.session.journeys.length > 0 ){
    req.session.journeys.forEach(function(journey){
      const items = {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${journey.departure}/${journey.arrival}`,
            images: ["https://media.istockphoto.com/vectors/high-speed-train-modern-flat-design-vector-illustration-vector-id684767302?k=20&m=684767302&s=612x612&w=0&h=kbunA6-wP9GWb0iPUuoEBk4Tkx8Uh8XUP16b49hO9bo=",]
          },
          unit_amount: (journey.price).toFixed(2)*100,
        },
        quantity: 1,
      }
      carts.push(items);
    });
    // carts.push({
    //   price_data: {
    //     currency: 'eur',
    //     product_data: {
    //       name: "Frais de port",
    //     },
    //     unit_amount: ( 30 - (30 * req.session.reduction))*100,
    //   },
    //   quantity: req.session.nbFraisPort,
    // })
    
    
  }else{
    res.redirect("/");
  }
  const session = await stripe.checkout.sessions.create({
    line_items: carts,
    mode: 'payment',
    success_url: `/validate-cart`,
    cancel_url: `/fail`,
  });

  res.redirect(303, session.url);
});


router.post("/result", async function (req, res, next) {
  if(req.session.user){
    const journeys = await journeyModel.find({date:req.body.date,departure: req.body.departure, arrival: req.body.arrival}).sort({price:1})
      if(!journeys.length>0) 
      {
        res.redirect ('/not-found')
      }else {
        res.render('result',{journeys, date:req.body.date} )
      }
  }
  else{
    res.redirect("/auth/signin")
  }
})


router.get('/historic', async function(req,res, next){
  if(req.session.user){   
    const user= await userModel.findOne({email:req.session.user}).populate('journeys');
    res.render('historic',{journeys:user.journeys})
  }else{
    res.redirect("/auth/signin")
  }
})

router.get('/delete/:id', function(req,res){
  if(req.session.user && req.session.journeys){
    req.session.journeys = req.session.journeys.filter(journey => journey._id !== req.params.id);
    res.redirect("/cart");
  }
  else{
    res.redirect("/")
  }
})

router.get('/logout', function(req,res){
  req.session.destroy();
  res.redirect("/auth/signin");
})

router.get('/profile', async function(req,res){
  if(req.session.user){   
    const user= await userModel.findOne({email:req.session.user}).populate('journeys');
    res.render("profile",{user, journeys: user.journeys})
  }else{
    res.redirect("/auth/signin")
  }
})

router.get('/success',function(req,res){
  res.render("success",{})
})
router.get('/fail',function(req,res){
  res.render("failed",{})
})

// Remplissage de la base de donnée, une fois suffit
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 1000

//   // Save  ---------------------------------------------------
//     for(var i = 0; i< count; i++){

//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

//     if(departureCity != arrivalCity){

//       var newUser = new journeyModel ({
//         departure: departureCity , 
//         arrival: arrivalCity, 
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });
       
//        await newUser.save();

//     }

//   }
//   res.render('index', { title: 'Express' });
// });




module.exports = router;
