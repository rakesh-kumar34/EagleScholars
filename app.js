/**
 * Module dependencies.
 */
var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path');

// NPM Dependency for session tracking
var session = require('express-session');
// Create new app in Express
var app = express();
// Get Database Connection Object
var connection = require('./db/db');
global.db = connection;

var bodyParser = require("body-parser");


// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 300000
  }
}));

// Middleware

app.get('/', routes.index); //call for main index page
app.get('/login', routes.index); //call for login page
app.post('/login', user.login); //call for login post
app.get('/home/student_dashboard', user.studentdashboard); //call for student dashboard page after student login
app.get('/home/admin_dashboard', user.admindashboard); //call for admin dashboard page after admin login
app.get('/home/logout', user.logout); //call for logout
app.get('/home/student_profile', user.studentprofile); //to render student profile
app.get('/home/student_contact', user.studentcontact); //call for student contact
app.get('/home/admin_profile', user.adminprofile); //to render admin profile
app.get('/home/admin_contact', user.admincontact); //call for admin contact
app.get('/home/admin_studentlist', user.adminstudentlist); //call for admin contact
app.get('/home/addstudent', user.addstudent); //call for admin contact
app.post('/home/signup', user.signup); //call for signup student post 
app.post('/home/studentfeedback', user.studentfeedback); //call for student feedback post 

// Server
app.listen(8080, () => {
  console.log("Server listening on port 8080");
});