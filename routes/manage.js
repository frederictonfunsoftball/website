var express = require('express');
var router = express.Router();

var db = require('../database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('manage/');
});
//
// Teams
//
/* GET teams listing. */
router.get('/teams', function(req, res, next) {
  db.getTeamsActive(function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.teams = rows;
    next();
  });
},
function(req, res, next){
  res.render('manage/teams');
});
router.get('/teams/:teamID', function(req, res, next) {
  res.render('manage/teams/teamID');
});
//
// Fields
//
router.get('/fields', function(req, res, next) {
  res.render('manage/fields');
});
router.get('/fields/:fieldID', function(req, res, next) {
  res.render('manage/fields/fieldID');
});
//
// Schedule
//
router.get('/schedule', function(req, res, next) {
  res.render('manage/schedule');
});
router.get('/schedule/gameID', function(req, res, next) {
  res.render('manage/schedule/gameID');
});
//
// Seasons
//
router.get('/seasons', function(req, res, next) {
  db.getSeasonsAll(function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);
    console.log("year: " + rows[0].year);
    res.locals.rows = rows;
    next();
  });
}, function(req, res, next) {
  res.render('manage/seasons');
  //res.render('manage/seasons', {rows: req.softball.rows});
});
router.get('/seasons/:year', function(req, res, next) {
  res.render('manage/seasons/year');
});

module.exports = router;
