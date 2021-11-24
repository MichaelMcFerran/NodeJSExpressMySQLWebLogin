/*
This file handles all page routings and HTTP requests
It is in a separate file from app.js to help readability
*/

const express = require('express');
var router = express.Router();
const dbConnection = require('../dbconfig').dbCon; // - import db config file and use the functions

/* GET login page as home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

// Login Authentification
// login script will check the MySQL dB if details match
// login form action is to 'auth', creates user and pass consts with entered values
// checks the details match by querying the accounts table in the dB accounts table
router.post('/auth', (request, response) => {
  // Get values submitted in POST form
  const { username, password } = request.body;
  // MySQL script to check user login details
  if (username && password) {
   const userDetailsSQL =
    "SELECT * FROM tekenabletest.user WHERE username = '" +
    username +
     "' AND password = '" +
     password +
    "'";
   dbConnection.query(userDetailsSQL, (error, results) => {
    console.log(results); // used to debug
    // change below to a conditional for username
    if (results.length > 0) {
     // sets session vars if result is returned, passessession var between page routing when user is logged on
     request.session.loggedin = true; 
     request.session.username = username; 
     request.session.password = password;
     response.redirect('/index'); // redirect to correct index homepage, URL/index is displayed on browser. app.get is needed to find + the page
    } else {
     response.send('Incorrect Username and/or Password!');
    }
    response.end();
   });
  } else {
   response.send('Please enter Username and Password!');
   response.end();
  }
 });
 
 // index router to homepage if login authentification is achieved, this is intermediate page between login and index/dashboard
 router.get('/index', (request, response) => {
   // broken
  if (request.session.loggedin) {
   console.log(
    request.session.username // grabs username so user can be addressed in the subsequent web pages
   );
 
   // put session grabbing vars here specific to user
   response.render('index', { title: "" + request.session.username + "'s Hub" }); // render page only on successful login
  } else {
   response.send('Please login to view this page!', request.session.username);
  }
  response.end();
 });

module.exports = router;
