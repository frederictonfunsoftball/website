var express = require('express');
var router = express.Router();
var db = require('../database.js');

//
// Seasons
//
router.get('/seasons/all', function(req, res, next) {
  db.getAllSeasons(function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);
    console.log("year: " + rows[0].year);
    res.render(state, rows);
    //next(state, rows);
  });
});
//router.get('/seasons/byYear', data, function(req, res, next) {
//  res.send('Season: ' + data);
//});

//
// Fields
//
router.get('/fields/all', function(req, res, next) {
  res.send('all fields');
});
//router.get('fields/byID', fieldID, function(req, res, next) {
//  res.send('Field: ' + fieldID);
//});

//
// Teams
//
router.get('/teams/all', function(req, res) {
  console.log("Working in: /teams/all");
  db.getTeamsAll(function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);

    var json = JSON.stringify(rows);

    console.log("Returning from: /teams/all");
    res.json(json);
  });
});
router.get('/teams/allActive', function(req, res) {
  db.getTeamsActive(function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);
    console.log("year: " + rows[0].year);

    var json = JSON.stringify(rows);

    res.json(json);
  });
});
router.get('/teams/name/byID/:teamID', function(req, res, next) {
  console.log("Fetching team name for ");
  var teamID = req.params.teamID;
  console.log(teamID);

  db.getTeamNameByID(teamID, function(state, rows) {
    console.log("State: " + state);
    console.log("rows: " + rows);

    var json = JSON.stringify(rows);

    console.log("Returning from: /teams/byID")
    res.json(json);
  });
});

//
// Games
//
router.get('/schedule/allActive', function(req, res) {
  console.log("Working in: /schedule/allActive");
  db.getScheduleActive(function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);

    var json = JSON.stringify(rows);

    console.log("Returning from: /schedule/allActive");
    res.json(json);
  });
});
router.get('/schedule/byMonth/:month', function(req, res) {
  console.log("Working in: /schedule/byMonth");
  var month = req.params.month;
  db.getScheduleByMonth(month, function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);

    var json = JSON.stringify(rows);

    console.log("Returning from: /schedule/byMonth");
    res.json(json);
  });
});
router.get('/schedule/byTeam/:teamID', function(req, res) {
  console.log("Working in: /schedule/byTeam");
  var team = req.params.teamID;
  db.getScheduleByTeamId(team, function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);

    var json = JSON.stringify(rows);

    console.log("Returning from: /schedule/byTeam");
    res.json(json);
  });
});


router.get('/schedule/export/:type', function(req, res, next) {
  switch(type) {
    case "all":
      db.getScheduleActive(function(state, rows) {
        console.log("State: " + state);
        console.log("Rows: " + rows);
      });
      break;
    case "may":
    case "june":
    case "july":
    case "august":
    case "september":
      db.getScheduleByMonth(type, function(state, rows) {
        console.log("State: " + state);
        console.log("Rows: " + rows);
      });
      break;
    default: //:type is a teamID
      db.getScheduleByTeam(type, function(state, rows) {
        console.log("State: " + state);
        console.log("Rows: " + rows);
      });
  }
  // Below code may need to go into the callback function above or into a new functiont that can commonly be called
  //code to convert rows to pdf
  //PDFDocument = require 'pdfkit'

  //# Create a document
  //doc = new PDFDocument

  //# Pipe it's output somewhere, like to a file or HTTP response
  //# See below for browser usage
  //doc.pipe fs.createWriteStream('output.pdf')

  //# Embed a font, set the font size, and render some text
  //doc.font('fonts/PalatinoBold.ttf')
  //  .fontSize(25)
  //  .text('Some text with an embedded font!', 100, 100)
  //  .fillColor("blue")
  //  .text('Here is a link!', 100, 100)
  //  .underline(100, 100, 160, 27, color: "#0000FF")
  //  .link(100, 100, 160, 27, 'http://google.com/')

  //# Finalize PDF file
  //doc.end()

  //code to send pdf to client
  //var file = fs.readFile(filePath, 'binary');
  //res.setHeader('Content-Length', stat.size);
  //res.setHeader('Content-Type', 'audio/mpeg');
  //res.setHeader('Content-Disposition', 'attachment; filename=your_file_name');
  //res.write(file, 'binary');
  //res.end();
});

router.get('/standings', function(req, res, next) {
  console.log("Starting standings route via api");
  db.getStandings(function(state, rows){
    console.log("State: " + state);
    console.log("Rows: " + rows);

    var json = JSON.stringify(rows);

    console.log("Returning from: /standings");
    res.json(json);
  });
});

router.get('/manage/scores/:gameID', function(req, res, next) {
  var gameID = req.params.gameID;

  db.getScoresByGameID(gameID, function(state, rows) {
    console.log("state: " + state);
    console.log("rows: " + rows);

    var json = JSON.stringify(rows);
    res.json(json);
  });
});

router.get('/manage/scores/add/:gameID/:awayScore/:homeScore/:userID', function(req, res, next) {
  console.log("in /manage/games/../../..");
  var gameID = req.params.gameID;
  //
  // Set game to played
  //
  db.updateGameStatus(gameID, function(state, rows) {
    console.log("state: " + state);
    next();
  });
}, function (req, res, next) {
  console.log("in /manage/games/../../.., second function");
  var gameID = req.params.gameID;
  var awayScore = req.params.awayScore;
  var homeScore = req.params.homeScore;
  var userID = req.params.userID;
  //
  // Insert score into Scores table
  //
  db.insertScore(gameID, awayScore, homeScore, userID, function(state, rows) {
    console.log("state:" + state);
    next();
  });
}, function (req, res) {
  console.log("in /manage/games/../../.., third function");
  var gameID = req.params.gameID;
  //
  // Return data for scores table on page
  //
  db.getScoresByGameID(gameID, function(state, rows) {
    console.log("state: " + state);
    console.log("rows: " + rows);

    var json = JSON.stringify(rows);
    console.log("Returning from /manage/games/../../..");
    res.json(json);
  });
});

router.get('/manage/scores/approve/:gameID/:scoreID', function(req, res, next) {
  var gameID = req.params.gameID;
  var scoreID = req.params.scoreID;
  db.approveScore(gameID, scoreID, function(state, rows) {
    next();
  });
}, function(req, res, next) {
  var gameID = req.params.gameID;
  //
  // Return data for scores table on page
  //
  db.getScoresByGameID(gameID, function(state, rows) {
    console.log("state: " + state);
    console.log("rows: " + rows);

    var json = JSON.stringify(rows);
    console.log("stringify rows: " + json);
    console.log("Returning from /manage/scores/approve/../..");
    res.json(json);
  });});

module.exports = router;
