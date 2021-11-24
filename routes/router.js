/*
This file handles all page routings and HTTP requests
*/
var express = require('express');
var router = express.Router();

/* GET login page as home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});


module.exports = router;
