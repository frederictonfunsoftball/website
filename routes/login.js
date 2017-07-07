var express = require('express');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var moment = require('moment');

var router = express.Router();

var db = require('../database.js');

router.use(function(req, res, next) {
  db.getScheduleNext2Weeks(function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].gameID);
    for (var i = 0; i < rows.length; i++) {
      console.log("before: " + rows[i].dateTime);
      rows[i].dateTime = moment(rows[i].dateTime).format("MMM Do ha");
      console.log("after: " + rows[i].dateTime);
    }
    res.locals.nextGames = rows;

    next();
  });
});


router.get('/', function(req, res, next) {
  //req.session.user="admin";
  //res.redirect('/');
  res.render('login');
});
router.post('/', function(req, res, next) {
  req.session.reset();
  db.login(req.body.email, req.body.password, function(err, data) {
    if(!err){
      var user = JSON.stringify(data);
      console.log("\nError: " + err);
      console.log("\nUser: " + user);
      console.log("\nLength: " + user.length);
      if (user.length <= 2) {
        res.locals.error = {message: "Invalid email or password."};
        res.render('login.jade');
      } else {
        // sets a cookie with the user's info
        user = JSON.parse(user);
        console.log("\n\n");
        console.log("user: " + user);
        console.log("user[0]: " + user[0]);
        console.log("user[0].displayName: " + user[0].displayName);
        console.log("user[0].userID: " + user[0].userID);
        req.session.user = user[0].displayName;
        req.session.role = user[0].role;
        req.session.userID = user[0].userID;
        res.redirect('/');
      }
    } else {
      res.redirect('/login');
    }
  });
});

router.get('/register', function(req, res, next) {
  res.render('loginRegister');
});
router.post('/register', function(req, res, next) {
  console.log("Calling db.loginRegister()");
  db.loginRegister(req.body.displayName, req.body.email, req.body.teamID, req.body.password, function(err, data) {
    if (!err) {
      // Registered Successfully
      res.render('loginRegisterSuccessful')
    } else {
      // Failed to Register
      res.render('loginRegisterFailed');
    }
  });
});


module.exports = router;
