/*
This file handles all page routings and HTTP requests
This is where the User story requirements are met using jQuery, AJAX calls and the dB
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
  res.render('register', { title: 'Register Page' });

});

/* GET register feedback for register page. Send it to the Front end JS page */
router.get('/registerUpdater', function(req, res, next) {
 // only send feedback if required
 if(req.session.sendFeedBack === true){
   /* 
    session destroy function used to clear session variables for use during
    user registration + requirement checking
   */
   function  clearSession() {
    req.session.destroy((err) => {
      if (err) {
      console.log(err);
      }
    });
   }
  // nested if/else statements for different conditionals to match user story
  if(req.session.usernameTaken){
    // Send feedback to user that they can't register a username that is already taken
    res.send(`The desired username: ${req.session.usernameTaken} is already registered. Please enter a unique username of aphanumeric characters`);
    //clear Session Variables
    clearSession();
    
  } else if (req.session.userRegistered){
    // Send feedback to user that they have registered, with details being stored in dB and can now login 
    res.send(`You have registered, login with your username : ${req.session.userName} `);
    // Clear session Variables
    clearSession();
  } else if (!(req.session.alphaNumeric)){
    // Send feedback to user that the entered values aren't alphanumeric
    res.send(`The characters entered are not alphanumeric(0-9,a-z,A-Z). Change the following username and retry : ${req.session.userName}`);
    // Clear session Variables
    clearSession();
  } else if (req.session.alphaNumeric){
    // checks password is valid only when values are alphanumeric, so then send feedback that password values aren't valid
    if(!(req.session.passwordValid)){
      res.send('You have entered an invalid password. Please enter a minimum of 8 characters including 1 uppercase, 1 lowercase and 1 number');
      // Clear session Variables
      clearSession();
    } else {
      // Clear session Variables
      clearSession();
    }  
  } // end of alphanumeric else if
 } // end of send feedback
}); // end of register updater


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
 
 // go to homepage if login authentification is achieved
 router.get('/index', (request, response) => {
  if (request.session.loggedin) {
   console.log(
    request.session.username // grabs username so user can be addressed in the subsequent web pages
   );
 
   // put session grabbing vars here specific to user
   response.render('index', { title: "" + request.session.username + "'s Hub" }); // render page only on successful login
  } else {
   response.send('Please login to view this page!');
  }
  response.end();
 });

 /* POST user creation form from register page */
 router.post('/registerUpdate', (request, response) => {

/* Test changing to get rather than post 
GET user creation form from register page */
// router.get('/registerUpdate', (request, response) => {
  // take in the form values
  const { usernameRegister, passwordRegister} = request.body;

  /*User story requirement 2 from README.MD 
  first check if there already exists a entry for this userID, to decide if we can insert into
  make query based on dB result*/
  const checkDistinctQuery = `SELECT DISTINCT username FROM tekenabletest.user WHERE userName= '${usernameRegister}'`;
  dbConnection.query(checkDistinctQuery, (error, results) => {
   console.log(results);
   if (results.length > 0) {
    request.session.distinctUser = false // session var for register page to check
    request.session.usernameTaken = usernameRegister // session var for register page to check
    request.session.sendFeedBack = true // trigger to send in /registerUpdater, deletes once session is destroyed 
    response.redirect('/register'); // Triggers the update by reloading the page

   } else {
    request.session.distinctUser = true; // used to allow username to be registered
    // Now check other User Story requirements
    // Check if username value is AlphaNumeric
    // console.log(isUserAlphaNum(usernameRegister));
    if (isUserAlphaNum(usernameRegister) === true){
      console.log('username is alphanumeric');
      request.session.alphaNumeric = true; // allow user to be registered
      // Nested Check if password is between 1-8 characters in length and contains 1 uppercase + 1 lower case character
      if (isPassValid(passwordRegister) === true){
        console.log('password is at least 8 characters with 1 Uppercase, 1 Lowercase and 1 number');
        request.session.passwordValid = true; // allow user to be registered
      } else{
        console.log('password is not 8 characters min with 1 uppercase, 1 lowercase and 1 number');
        request.session.passwordValid = false; // deny registering of user
        request.session.sendFeedBack = true // trigger to send to /registerUpdater get request, deletes once session is destroyed 
        response.redirect('/register'); // Triggers the update by reloading the page


      } // end of nested if else
    } else{
      console.log('username is not alphanumeric');
      request.session.alphaNumeric = false; // deny registering of user
      request.session.sendFeedBack = true // trigger to send to /registerUpdater get request, deletes once session is destroyed 
      response.redirect('/register'); // Triggers the update by reloading the page

    }

   }// end of nested else 

   // if all conditions are met/true update dB 
   if (request.session.distinctUser && request.session.alphaNumeric && request.session.passwordValid){
    const registerUserQuery = `INSERT INTO tekenabletest.user (username, password) VALUES ('${usernameRegister}', '${passwordRegister}')`;
    dbConnection.query(registerUserQuery, (err, result) => {
    if (err) {
     throw err;
    } else{
      request.session.userRegistered = true; // to let the user know that their account has been created
      request.session.userName = usernameRegister; // send to user on front end with the feedback
      request.session.sendFeedBack = true; // trigger to send in /registerUpdater, deletes once session is destroyed
      response.redirect('/register'); // Triggers the update by reloading the page
    } 
    }); // end of nested dB insert query
   }

  }); // end of outer dB query check and conditional checks
 
  // send back to same page once updated or inserted - BROKEN
  // response.redirect('/register');
 });// end of register update form post request

 // Logout, end session and return to homepage
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
   if (err) {
    console.log(err);
   } else {
    res.redirect('/');
   }
  });
 });

 /*
 Function to check for alphanumeric values - user requirement charcodeAt labels current iteration 
 string value as mapped to unicode table in decimal format then we check for Alphanumeric values
 returning true if values are with the range. Unicode table - https://www.tamasoft.co.jp/en/general-info/unicode-decimal.html
 */
 function isUserAlphaNum(string) {
  let code, i, len;
  for (i = 0, len = string.length; i < len; i++) {
    code = string.charCodeAt(i);
    // if values aren't within decimal/mapped range they are not alphanumeric
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // uppercase (A-Z)
        !(code > 96 && code < 123)) { // lowercase (a-z)
      return false;
    }
  }
  return true;
}

/*
Function to check for a minimum password length of 8 characters, with 1 number, 1 uppercase value and 1 lowercase
*/
function isPassValid(passString) {

  let stringLength = passString.length;
  let passCode, i, len;
  let numberCount = 0, upperCaseCount = 0, lowerCaseCount = 0;
  console.log(stringLength);
  if (stringLength >= 8 && stringLength <= 50){
    // nested for loop only check if length is within range
    for (i = 0, len = passString.length; i < len; i++) {
      passCode = passString.charCodeAt(i);
      console.log(passCode);
      //add to a count for Uppercase, Lowercase, number check
      if (passCode > 47 && passCode < 58){
        numberCount++; // numeric (0-9) count add one
      } else if (passCode > 64 && passCode < 91) {
        upperCaseCount++; // uppercase (A-Z) count add one
      } else if (passCode > 96 && passCode < 123) {
        lowerCaseCount++; // lowercase (a-z) count add one
      }
    } // end of for loop
     console.log(`Number Count : ${numberCount}, Uppercase Count : ${upperCaseCount}, Lowercase Count : ${lowerCaseCount}`)
    // After counting values only return true if there's a minimum of one of each type
    let expression;
    if (numberCount >= 1 && upperCaseCount >= 1 && lowerCaseCount >= 1){
      // return true;
      expression = true;
      if(expression){
        return true;
      }
  
    } else {
      // return false;
      expression = false;
      if(expression === false){
        return false;
      }
    } 
    return expression;

  } else {
    return false;
  }
}

module.exports = router;
