var express = require('express');
var router = express.Router();
var db = require('../database.js');
var PDFDocument = require('pdfmake');
var fs = require('fs');

var fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-Italic.ttf'
	}
};
var printer = new PDFDocument(fonts);

/* GET full schedule listing. */
router.get('/', function(req, res, next) {
  db.getScheduleActive(function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.schedule = rows;
    res.locals.type = "All Games";
    next();
  });
},
function(req, res, next){
  res.render('schedule');
});

router.get('/month/:month/', function(req, res, next) {
  var month = req.params.month;
  db.getScheduleByMonth(month, function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.schedule = rows;
    res.locals.type = "By Month - " + month;
    next();
  });
},
function(req, res, next){
  res.render('schedule');
});
/* GET schedule listing by team */
router.get('/teamid/:teamID', function(req, res, next) {
  var teamID = req.params.teamID
  db.getScheduleByTeamID(teamID, function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.schedule = rows;
    res.locals.type = "By Team - " + teamID;
    next();
  });
},
function(req, res, next){
  res.render('schedule');
});

/* Export schedule to PDF */
router.get('/export', function(req, res, next){
  console.log("\n\nIn export router code...");

  var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };

  console.log("\n\nCreating pdfDoc file");
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  console.log("piping to disk");
  pdfDoc.pipe(fs.createWriteStream('public/pdf/basics.pdf'));
  console.log("ending write");
  pdfDoc.end();

  console.log("leaving router");

  next();
},
function(req, res, next){
  res.render('schedule');
});


router.get('/submitScore', function(req, res, next) {
  db.getSchedulePendingGames(function(state, rows) {
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.pendingGames - rows;
    next();
  });
},
function(req, res, next) {
  res.render('submitScore');
});

router.post('/submitScore/submit', function(req, res, next) {
  var user_id = req.body.id;
});


module.exports = router;
