var express = require('express');
var router = express.Router();
var db = require('../database.js');
var PDFDocument = require('pdfmake');
var fs = require('fs');
var icalToolkit = require('ical-toolkit');

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

router.post('/export/ical', function(req, res, next) {
	console.log("Inside /export/ical");
	console.log("req.body: " + req.body);
	var body = req.body;
	//console.log("body: " + JSON.stringify(body));
  if (body.type == "all") {
		//body.type = all
		db.getScheduleActive(function(state, rows){
	    console.log("State: " + state);
	    console.log("numRows: " + rows.length);
	    console.log("first row: " + rows[0].id);
			res.locals.data = rows;
			next()
		});
	} else if (body.type == "byMonth") {
		//body.type = byMonth
  	//body.month
		db.getScheduleByMonth(body.month, function(state, rows){
	    console.log("State: " + state);
	    console.log("numRows: " + rows.length);
	    console.log("first row: " + rows[0].id);
			res.locals.data = rows;
			next();
		});
	} else if (body.type == "byTeam") {
		//body.type = byTeam
		//body.teamID
		console.log("Body.TeamID: " + body.teamID);
	  db.getScheduleByTeamId(body.teamID, function(state, rows){
	    console.log("State: " + state);
	    console.log("numRows: " + rows.length);
	    console.log("first row: " + rows[0].id);
			res.locals.data = rows;
			next();
		});
	}
},
function(req, res, next) {
	console.log("Inside generateICS");
	data = res.locals.data;
	//console.log("Data: " + JSON.stringify(data));
	//console.log(data[0].gameID);

	//Create a builder
	var builder = icalToolkit.createIcsFileBuilder();

	/*
	 * Settings (All Default values shown below. It is optional to specify)
	 * */
	builder.spacers = true; //Add space in ICS file, better human reading. Default: true
	builder.NEWLINE_CHAR = '\r\n'; //Newline char to use.
	builder.throwError = true; //If true throws errors, else returns error when you do .toString() to generate the file contents.
	builder.ignoreTZIDMismatch = true; //If TZID is invalid, ignore or not to ignore!


	/**
	 * Build ICS
	 * */

	//Name of calander 'X-WR-CALNAME' tag.
	builder.calname = 'FrederictonFunSoftball-2017';

	//Cal timezone 'X-WR-TIMEZONE' tag. Optional. We recommend it to be same as tzid.
	builder.timezone = 'atlantic/halifax';

	//Time Zone ID. This will automatically add VTIMEZONE info.
	builder.tzid = 'atlantic/halifax';

	//Method
	builder.method = 'PUBLISH';

	//console.log(req.body);
	console.log("\n\nStarting to build events...\n")

	//Add events
	builder.events.push({

	  //Event start time, Required: type Date()
	  start: new Date(),
	  //Event end time, Required: type Date()
	  end: new Date(),
	  //transp. Will add TRANSP:OPAQUE to block calendar.
	  transp: 'OPAQUE',
	  //Event summary, Required: type String
	  summary: data[0].gameID.toString(),//JSON.stringify(data),
	  //Alarms, array in minutes
	  alarms: [1440, 60],
	  //Creation timestamp, Optional.
  	stamp: new Date(),
	  //Location of event, optional.
	  location: 'Home',
	  //What to do on addition
	  method: 'PUBLISH',
	  //Status of event
	  status: 'CONFIRMED',
	  //Url for event on core application, Optional.
	  url: 'https://www.frederictonfunsoftball.com'
	});

	//Optional tags on VCALENDAR level if you intent to add. Optional field
	//builder.additionalTags = {
	//  'SOMETAG': 'SOME VALUE'
	//};


	//Try to build
	var icsFileContent = builder.toString();

	//Check if there was an error (Only required if yu configured to return error, else error will be thrown.)
	if (icsFileContent instanceof Error) {
	  console.log('Returned Error, you can also configure to throw errors!');
	  //handle error
	}

	//console.log("res.body: " + JSON.stringify(res.body));
	//console.log("req.body: " + req.body.tostring());
	//console.log(JSON.parse(req.body));
  var path = "public/schedule/ical/ical.ics";
	console.log("\n\nTrying to write file...\n")
	fs.writeFile(path, icsFileContent, function(err) {
		if(err) {
			return console.log("File Write Error: " + err);
		}

		console.log("File was saved...");

		res.setHeader('Content-disposition', 'attachment; filename=ical.ics');
		res.setHeader('Content-type', 'text/calendar');
		//res.setHeader('Content-type', 'application/octet-stream');

		console.log("Downloading file now");
		res.download(path);
		console.log("done downloading file");
	});

	//Here isteh ics file content.
	//console.log(icsFileContent);
	//res.download(icsFileContent);
	//res.send(icsFilecontent);
  //res.send("process Complete");
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
