var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 9090;


var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var moment = require('moment');
var session = require('client-sessions');

var routeIndex = require('./routes/index');
var routeStandings = require('./routes/standings');
var routeSchedule = require('./routes/schedule');
var routeTeams = require('./routes/teams');
var routeFields = require('./routes/fields');
var routeUsers = require('./routes/users');
var routeManage = require('./routes/manage');
var routeAPI = require('./routes/api');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName: 'session',
  secret: 'asdfl@1a5s6df6a5s#df^651adlrg*dfgh12898sdf1g89sdf18gsdf8g44354$#%%&^&grgxvnmn',
  duration: 7 * 24 * 60 * 60 * 1000, // 7 days
  activeDuration: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,                     // prevents browser JavaScript from accessing cookies.
  secure: false,                      // ensures cookies are only used over HTTPS
  ephemeral: true                     // deletes the cookie when the browser is closed.
}));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
})

// general
app.use('/', routeIndex);
app.use('/contact', routeIndex);
app.use('/leagueRules', routeIndex);

// Teams
app.use('/teams', routeTeams);

// Schedule
app.use('/schedule', routeSchedule);

// Standings
app.use('/standings', routeStandings);

// Fields
app.use('/fields', routeFields);

// Admin
//app.get('/admin', admin);

// Manage
app.use('/manage', routeManage);

// Database
app.use('/api', routeAPI);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handlers

// development error handler, will print stacktrace
if (app.get('env') == 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, no stacktrace
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


var server = app.listen(port, ipaddress, function() {
  var host = server.address().address;
  var port = server.address().port;
});
