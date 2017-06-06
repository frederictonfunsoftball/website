var express = require('express');
var router = express.Router();

var db = require('../database.js');

/* GET teams listing. */
router.get('/', function(req, res, next) {
  db.getTeamsActive(function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.teams = rows;
    next();
  });
},
function(req, res, next){
  res.render('teams');
});

/* GET team by ID */
router.get('/team/:teamid', function(req, res, next) {
  db.getTeamByID(teamID, function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.teams = rows;
    next();
  });
},
function(req, res, next){
  res.render('index');
});


module.exports = router;
