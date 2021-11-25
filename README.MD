# NodeJSExpressMySQLWebLogin
## Description
The following repo is intended to complete the following user story.
But first, the Technology stack used included -
*   Node.Js
*   Express web Framework
*   MySQL (local development using MySql server and Workbench GUI)
*   Pug Template Engine
*   Bootstrap stylesheets for a mobile first website

## User Story
As an end user, I want to be able to sign up to the web application using only a username and password. 
The following are the user requirements, 
1. The Username field accepts alpha numeric values only
2. The Username is not already registered
3. The password has a minimum length of 8 characters and contains at least 1 number, 1 uppercase and 1 lower case letter
4. The user gets feedback when the username doesn't meet the criteria
5. Upon submission of a valid username and password, the user data is persisted to a database
6. The user gets feedback that they have been registered

### No need to address user authentication or authorisation, passwords may be stored as plain text

## Configexample.ini
This file is intented as a demonstration file for use in connecting to your own database.
Change the values in this file to your own database parameters and server parameters,
then save as config.ini in the root directory of the repo. The server files can then use this file
to grab your dB parameters and setup a connection as seen on dBconfig.js. So now any file can access them
to query the local database. 

## Database
The database used is a simple mySQL server that is manipulated with MySQL Workbench. A schema was created and The only table within it is one called 'user'.
The columns set up were,
*   idUser - Set to Auto Increment on each new user registered, NOT NUll (must have a value) and as the Primary Key
*   username - Set to NOT NUll (must have a value)
*   password - Set to NOT NUll (must have a value)
Therefore, the MYSQL script used to login and check if a username has been registered already, are written to suit this table format.
The MySQL scripts on the router.js page are designed to be used with this database format specifically and probably would require a rewrite to suit another database if required.