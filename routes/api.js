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
//router.get('/teams/byID', teamID, function(req, res, next) {
//  res.send('team: ' + teamID);
//});

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
  });});
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

module.exports = router;
