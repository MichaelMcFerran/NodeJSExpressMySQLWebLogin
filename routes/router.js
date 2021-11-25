/*
This file handles all page routings and HTTP requests
It is in a separate file from app.js to help readability
*/

const express = require('express');
var router = express.Router();
const dbConnection = require('../dbconfig').dbCon; // - import db config file and use the functions

/* GET login page as home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login Page' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  // if distinct user sess var is true, let user know
  if(req.session.distinctUser === false){
    // move to front end - used for debugging
    console.log(`The desired username: ${req.session.usernameTaken} is already registered. Please enter a unique username of 1-8 aphanumeric characters`)
    res.render('register', { title: 'Register Page',
    session_usernameTaken: req.session.usernameTaken
  });
  } else {
    res.render('register', { title: 'Register Page' });
  }

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
 
 // go to homepage if login authentification is achievef
 router.get('/index', (request, response) => {
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

 /* POST user creation form from register page */
router.post('/registerUpdate', (request, response) => {
  // take in the form values
  const { usernameRegister, passwordRegister} = request.body;

  /*User story requirement 2 from README.MD 
  first check if there already exists a entry for this userID, to decide if we need to update or insert into
  make query based on dB result*/
  const checkEntryQuery = `SELECT DISTINCT username FROM tekenabletest.user WHERE userName= '${usernameRegister}'`;
  dbConnection.query(checkEntryQuery, (error, results) => {
   console.log(results);
   if (results.length > 0) {
    request.session.distinctUser = false // session var for register page to check
    request.session.usernameTaken = usernameRegister // session var for register page to check
    response.redirect('/register');
   } else {
    request.session.distinctUser = true;
   }
  //  dbConnection.query(updateOrInsertUserBiometricsQuery, (err, result) => {
  //   if (err) {
  //    throw err;
  //   } else {
  //    console.log(result);
  //   }
  // }); // end of nested dB insert/update query
  }); // end of outer dB query check
 
  // send back to same page once updated or inserted - BROKEN
  // response.redirect('/register');
 });

 // Logout and end session
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
   if (err) {
    console.log(err);
   } else {
    res.redirect('/');
   }
  });
 });

module.exports = router;
