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

/* GET home page. */
router.get(['/', '/index'], function(req, res, next){
  //db.getRecentScores()(function(state, rows) {
  //  console.log("State: " + state);
  //  console.log("numRows: " + rows.length);
  //  console.log("first row: " + rows[0].id);
  //  res.locals.recentScores = rows;
  //  next();
  //});
  next();
},
function(req, res, next){
  res.render('index');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});
router.post('/contact/submit', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var requestType = req.body.requestType;
  var body = req.body.body;
  var subject = "Website Form Submission - " + requestType;
  var message = "From: " + name + "\nemail: " + email + "\nRequest Type = " + requestType + "\nBody: \n\n" + body;

  generator.on('token', function(token) {
    console.log('New token for %s: %s', token.user, token.accessToken);
  });

  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use successfully
    auth: {
      user: 'frederictonfunsoftball@gmail.com',
      pass: 'Ilike2softball'
    }
  };

  /*var transporter = nodemailer.createTransport(
    service: 'gmail',
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: 'frederictonfunsoftball@gmail.com',
        clientId: '673936498809-7uum8nf9o5lkd3d1jodvs3co76dt0krf.apps.googleusercontent.com',
        clientSecret: 'eMkACzq3GdldeUCUTw7hina0',
        refreshToken: token
      })
    }
  });
*/
  var mailOptions = {
    from: email,
    to: 'frederictonfunsoftball@gmail.com',
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });

  res.locals.message = "Message successfully sent!";
  res.render('contact');
});

router.get('/logout', function(req, res, next) {
  req.session.reset();
  res.redirect('/');
});

router.get('/leagueRules', function(req, res, next) {
  res.render('leagueRules.jade');
});

module.exports = router;
