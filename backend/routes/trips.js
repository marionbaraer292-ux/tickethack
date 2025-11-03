var express = require('express');
var router = express.Router();
const Trip = require('../models/trips');

/* GET trips listing. */
/* router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/ 

router.get('/', (req, res) => {
	Trip.find().then(data => {
		res.json({ trip: data });
	});
});

module.exports = router;
