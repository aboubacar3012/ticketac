var express = require('express');
var router = express.Router();
var {journeyModel}= require('../models/journey')
const {userModel} = require('../models/user');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2022-07-20","2022-06-30","2022-06-25","2022-06-15","2022-07-24"]

/* GET auth page. */
router.get('/auth', function(req, res, next) {
  res.render('auth', { title: 'Express' });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET not-found page. */
router.get('/not-found', function(req, res, next) {
  res.render('not-found', { title: 'Express' });
});
/* GET cart page. */
router.get('/cart', async function(req, res, next) {
	const user = await userModel.findOne({email:req.session.user}).populate('journeys');
  res.render('cart', { user });
});

/* GET cart page. */
router.get('/addjourney', async function(req, res, next) {
	if (req.session.user){
		const user= await userModel.findOne({email:req.session.user}).populate('journeys');
		const journey = await journeyModel.findById(req.query.id);
		user.journeys.push(journey)
		await user.save()
	}
	res.redirect('/cart');
  });

// // Remplissage de la base de donnée, une fois suffit
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 300

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

router.post("/result", async function (req, res, next) {
const journeys= await journeyModel.find({date:req.body.date,
departure: req.body.departure, arrival: req.body.arrival})
if(!journeys.length>0) 
{
	res.redirect ('/not-found')
}else {
	res.render('result',{journeys, date:req.body.date} )
}
})



module.exports = router;
