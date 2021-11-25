// - The following JS file is to begin dB Connection and allow all Js files to access the dB
// - using mySQL scripts. It is removed from app.js to reduce it's breadth of functions

const fs = require('fs'); // This module allows file system access
const ini = require('ini'); // This module allows interaction with configuration files of type .ini

//Read config file using the fs and ini modules
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8')); 
const databaseSettings = config.database_settings; // Get the hidden database settings from the config variable

// set mysql dB dependency
const mysql = require('mysql');

// setting dB credentials, change this to suit local/cloud dB credentials
const dbParam = {
 host: databaseSettings.db_host,
 user: databaseSettings.db_user,
 password: databaseSettings.db_pass, 
 database: databaseSettings.db_name, 
};

// Begin connection to dB as a pool of connections to allow continuous data inputs asynchronously
// Note: help for reconnection from https://github.com/mysqljs/mysql/issues/1478
const dbConnection = mysql.createPool(dbParam);
// - Error listener for any database connection errors
dbConnection.on('error', (err) => {
 if (err.code === 'PROTOCOL_CONNECTION_LOST') {
  // - If server closes the connection.
  console.log(
   '/!\\ Cannot establish a database connection. /!\\ (' + err.code + ')'
  );
 } else {
  console.log('not connected to database');
 }
});

// exporting the db connection for other js scripts to use
module.exports.dbCon = dbConnection;