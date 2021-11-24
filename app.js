/* App.js Middleware Setup File
--------------------------------------------------------- 
Key Functions:
- Setup express app variable
- Controls web page routing by sending all page requests beginning with / to routes/router.js
*/

/* Import libraries and frameworks
--------------------------------------------------------- */
var createError = require('http-errors');
var express = require('express');  // web development framework
const session = require('express-session'); // Allows creation of session variables for user login/auth
var path = require('path');
const favicon = require('static-favicon'); // allows logos on express web pages
var cookieParser = require('cookie-parser'); // allows for manipulation of website cookies
var logger = require('morgan'); // provides debuggin output of http requests

// creates routes variable which will direct all http requests to the desired web page.
var Router = require('./routes/router');

// express is the web dev framework for handling http requests
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// sets package to direct session constiables for users, code determines if user is logged in - seen on router.js
app.use(
  session({
   secret: 'Tekenable',
   resave: true,
   saveUninitialized: true,
  })
 );

// setup logger, express, static html files, cookies, favicon etc
app.use(favicon()); // puts icons on web page
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// sends any http request that begins with / to router const above then to routes/router.js
app.use('/', Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; //allows the vars and functions of this middleware to be called upon in other JS files within directory
