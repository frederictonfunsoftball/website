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
var routeLogin = require('./routes/login');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

function requireHTTPS(req, res, next) {
  //console.log("req.secure: " + req.secure);
  //console.log("req.get('x-forwarded-proto'): " + req.get('x-forwarded-proto'));
  //console.log("req.get('host'): " + req.get('host')); 
  //console.log("req.url: " + req.url);
  if (!req.get('x-forwarded-proto')) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};
app.use(requireHTTPS);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName: 'session',
  secret: 'asdfl@1a5s6df6a5s#df^651adlrg*dfgh12898sdf1g89sdf18gsdf8g44354$#%%&^&grgxvnmn',
  duration: 7 * 24 * 60 * 60 * 1000, // 7 days
  activeDuration: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: false,  //should be true                   // prevents browser JavaScript from accessing cookies.
  secure: false,                      // ensures cookies are only used over HTTPS
  ephemeral: true                     // deletes the cookie when the browser is closed.
}));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.role = req.session.role;
  res.locals.userID = req.session.userID;

  //console.log("user: " + res.locals.user);
  //console.log("role: " + res.locals.role);
  //console.log("userID: " + res.locals.userID);
  next();
})

// general
app.use('/', routeIndex);
app.use('/contact', routeIndex);
app.use('/leagueRules', routeIndex);
app.use('/login', routeLogin);

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

//letsencrypt
var letsEncryptUrl = "ExGoethVCnO-mxEI5hfG6xjnu2-khvRo-ss82WmJq8k";
var letsEncryptResponse = "ExGoethVCnO-mxEI5hfG6xjnu2-khvRo-ss82WmJq8k.JgTjBjCgGK2aJWo66vm_dFn5XBKVkUg2QBop45KUjZQ";
app.get('/.well-known/acme-challenge/' + letsEncryptUrl, function (req, res) {
  console.log("handling acme challenge");
  res.send(letsEncryptResponse);
  res.end();
})

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


// var lex = require('greenlock-express').create({
//   server: 'staging',
//   //server: 'https://acme-staging.api.letsencrypt.org/directory',
//   //server: 'htps://acme-v01.api.letsencrypt.org/directory',
//   email: 'frederictonfunsoftball@gmail.com',
//   agreeTos: true,
//
// // If you wish to replace the default plugins, you may do so here
// //
//   challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
//   store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }),
//
// // You probably wouldn't need to replace the default sni handler
// // See https://git.daplie.com/Daplie/le-sni-auto if you think you do
// //, sni: require('le-sni-auto').create({})
//   approvedDomains: approveDomains
//   //approvedDomains: [ 'frederictonfunsoftball.com', '127.0.0.1' ]
// });//.listen(80, 443);
//
// function approveDomains(opts, certs, cb) {
//   // This is where you check your database and associated
//   // email addresses with domains and agreements and such
//
//
//   // The domains being approved for the first time are listed in opts.domains
//   // Certs being renewed are listed in certs.altnames
//   if (certs) {
//     opts.domains = certs.altnames;
//   }
//   else {
//     opts.domain = ['frederictonfunsoftball.com', '127.0.0.1'];
//     opts.email = 'frederictonfunsoftball@gmail.com';
//     opts.agreeTos = true;
//   }
//
//   // NOTE: you can also change other options such as `challengeType` and `challenge`
//   // opts.challengeType = 'http-01';
//   // opts.challenge = require('le-challenge-fs').create({});
//
//   cb(null, { options: opts, certs: certs });
// }
//
// // handles acme-challenge and redirects to https
// require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
//   console.log("Listening for ACME http-01 challenges on", this.address());
// });
//
// // handles your app
// require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
//   console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
// });
