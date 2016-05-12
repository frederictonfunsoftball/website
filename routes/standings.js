var express = require('express');
var router = express.Router();

var db = require('../database.js');


/* GET standings listing. */
router.get('/', function(req, res, next) {
  console.log("Starting standings route");
  //db.getStandingsA(function(state, rows){
//    console.log("State: " + state);
    //console.log("numRows: " + rows.length);
    //console.log("first row: " + rows[0].id);
    //res.locals.standingsA = rows;
    //next();
  //});

  var request = require('request');
  request('http://www.frederictonfunsoftball.com/api/standings', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(1);
      console.log(body);

      body = JSON.parse(body);
      res.locals.standingsScores = body;

      request('http://www.frederictonfunsoftball.com/api/teams/allActive', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("test2");
          console.log(body);

          body = JSON.parse(body);
          res.locals.standingsTeams = body;

          var scores = JSON.parse(res.locals.standingsScores);
          var teams = JSON.parse(res.locals.standingsTeams);
          console.log("locals: " + res.locals.standingsScores);
          console.log("scores: " + scores);
          console.log("FIRST");
          console.log(scores.length);
          console.log(scores[0].status);
          console.log(scores[0].awayScore);
          console.log(scores[0].homeScore);
          console.log(scores[0].awayID);
          console.log(scores[0].homeID);
          console.log(scores[0].awayName);
          console.log(scores[0].homeName);
          console.log(scores[0].awayDisplayID);
          console.log(scores[0].homeDisplayID);

          console.log("TESTER: " + teams.length);
          for(i = 0; i < teams.length; i++) {
            teams[i].wins = 0;
            teams[i].losses = 0;
            teams[i].ties = 0;
          }

          scores[0].wins = 4;
          console.log(scores[0].wins);

          for(i = 0; i < scores.length; i++) {
            console.log(scores[i].status);
            console.log(scores[i].awayName + " - " + scores[i].homeName);
            console.log(scores[i].awayScore + " - " + scores[i].homeScore);
            if(scores[i].status == 'approved'){
              if(scores[i].awayScore == scores[i].homeScore) { //ties
                console.log("game is a tie");
                for(j = 0; j < teams.length; j++) {
                  if(scores[i].awayID == teams[j].teamID){
                    teams[j].ties = teams[j].ties + 1;
                  }
                  if(scores[i].homeID == teams[j].teamID){
                    teams[j].ties = teams[j].ties + 1;
                  }
                }
              } //ties
              else if (scores[i].awayScore > scores[i].homeScore) { //away wins
                console.log("away wins");
                for(j = 0; j < teams.length; j++) {
                  if(scores[i].awayID == teams[j].teamID){
                    teams[j].wins = teams[j].wins + 1;
                  }
                  if(scores[i].homeID == teams[j].teamID){
                    teams[j].losses = teams[j].losses + 1;
                  }
                }
              } //away wins
              else { //home wins
                console.log("home wins");
                for(j = 0; j < teams.length; j++) {
                  if(scores[i].awayID == teams[j].teamID){
                    teams[j].losses = teams[j].losses + 1;
                  }
                  if(scores[i].homeID == teams[j].teamID){
                    teams[j].wins = teams[j].wins + 1;
                  }
                }
              } //home wins
            }
          }

          var divisionA = []
          var divisionB = [];
          var divisionC = [];

          for(i = 0; i < teams.length; i++) {
            console.log(teams[i].name + " wins: " + teams[i].wins);
            console.log(teams[i].name + " losses: " + teams[i].losses);
            console.log(teams[i].name + " ties: " + teams[i].ties);

            teams[i].games = teams[i].wins + teams[i].losses + teams[i].ties;
            teams[i].winningPercent = teams[i].wins / teams[i].games * 100;

            if(teams[i].division == "Division A") {
              divisionA[divisionA.length] = teams[i];
            }
            else if(teams[i].division == "Division B") {
              divisionB[divisionB.length] = teams[i];
            }
            else {
              divisionC[divisionC.length] = teams[i];
            }
          }

          console.log("Division A: " + divisionA.length);
          console.log("Division B: " + divisionB.length);
          console.log("Division C: " + divisionC.length);

          res.locals.standingsA = divisionA;
          res.locals.standingsB = divisionB;
          res.locals.standingsC = divisionC;

          console.log("test");
          console.log(divisionA);
          console.log("test2");
          console.log(JSON.stringify(divisionA));

        }
        next();
      });
    }
  });

/*
  var dataToAppend = "";
  var currentLine = "";
  for(i = 0; i < rows.length; i++) {
    var myDate =  moment(rows[i].dateTime).format("MMM Do ha");
    currentLine = "<tr><td align='center'>"+myDate+"</td><td align='center'>"+rows[i].awayTeamID+"</td>";
    currentLine += "<td align='center'>"+rows[i].homeTeamID+"</td><td align='center'>"+rows[i].fieldID+"</td>";
    currentLine += "<td align='center'>"+rows[i].status+"<br><input type='button' value='Submit Result'></td></tr>";
    dataToAppend += currentLine;
  }

  $("#scheduleTable").append(dataToAppend);

    res.locals.standingsA = body;
  });

*/

  //next();
},
function(req, res, next){
  res.render('standings');
});

module.exports = router;
