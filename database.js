var mysql = require('mysql');
var pool;

var sha256 = require('js-sha256');
//var passwordHashAndSalt = require("password-hash-and-salt");
var bcrypt = require('bcrypt');
const saltRounds = 10;

//var env = "local";
//var env = "openShiftDev";
var env = "openShiftProd";

if(env == "local")
{
  pool = mysql.createPool({
    connectionLimit: 100,
    host: '192.168.0.200',
    user: 'softball',
    password: 'Ilike2playsoftball',
    database: 'softball',
    debug: false
  });
}
else if (env == "openShiftDev")
{
  pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.OPENSHIFT_MYSQL_DB_HOST,
    port: process.env.OPENSHIFT_MYSQL_DB_PORT,
    user: 'adminRP7uRiv',
    password: 'P53nEKwRX_tE',
    database: 'softballdev',
    debug: false
  });
}
else if (env == "openShiftProd")
{
  pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.OPENSHIFT_MYSQL_DB_HOST,
    user: process.env.OPENSHIFT_MYSQL_DB_PORT,
    user: 'adminTCgcYCU',
    password: 'kA3l6IVkQLdH',
    database: 'softball',
    debug: false
  });
}


//
// Login Queries
//
// Login
exports.login = function(email, password, callback) {
  var sql = "select userID, displayName, hash, email, role, active from users where email = '" + email + "' and active = 1;";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    console.log("Calling query 1");
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(true);
        return;
      }
      if(rows == "") {
        console.log("No Users Found");
        callback(true);
        return;
      }
      console.log("Starting hash check");
      console.log("rows: " + rows);
      console.log("email: " + rows[0].email);
      console.log("hash: " + rows[0].hash);
      console.log("password: " + password);
      console.log("hash: " + rows[0].hash);
      console.log("active: " + rows[0].active);

      bcrypt.compare(password, rows[0].hash, function(err, doesMatch) {
        console.log ("err: " + err);
        console.log ("doesMatch: " + doesMatch);
        if(!doesMatch) {
          console.log ("compare error");
          callback(true);
          return;
          //throw new Error('Something went wrong!');
        /*}
        /*if(!verified) {
          console.log ("invalid login");
          callback(true);
          return;
          //console.log("Don't try! We got you!");*/
        } else {
          //console.log("The secret is...");
          console.log("returning");
          callback(false, rows);
          return;
        }
      });
    });
  });
};

// Registration
exports.loginRegister = function(displayName, email, teamID, password, callback) {
  var salt = bcrypt.genSaltSync(saltRounds);
  console.log("salt: " + salt);
  var hash = bcrypt.hashSync(password, salt);
  console.log("hash: " + hash);
  var sql = "insert into users (displayName, email, hash) values ('" +displayName+ "', '" + email + "', '" + hash + "');"
  console.log("SQL: " + sql);
  pool.getConnection(function(err, connection) {
    console.log("Calling query 1");
    connection.query(sql, function(err, rows) {
      if(err) {
        console.log("Failed to register user\n\n");
        console.log(err);
        callback(true);
        return;
      } else {
        console.log("Successfully registered user");
        callback(false);
      }
    });
  });
};

//
// Seasons Queries
//
// Get all seasons
exports.getSeasonsAll = function(callback) {
  var sql = "SELECT * FROM seasons";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};
// Get active season
exports.getSeasonsActive = function(callback) {
  var sql = "SELECT * FROM seasons where active=true;";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};
// Get active season
exports.getSeasonByYear = function(year, callback) {
  var sql = "SELECT * FROM seasons where year=" + year;
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};


//
// Field Queries
//
// Get all fields
exports.getFieldsAll = function(callback) {
  var sql = "select * from fields";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

// Get all active fields
exports.getFieldsActive = function(callback) {
  var sql = "select * from fields where active = true";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

// Get all field by id
exports.getFieldsByID = function(fieldID, callback) {
  var sql = "select * from fields where id = " + fieldID;
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

//
// Team Queries
//
// Get all teams
exports.getTeamsAll = function(callback) {
  var sql = "select * from teams";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};
// Get active teams
exports.getTeamsActive = function(callback) {
  var sql = "select t.teamID as teamID, t.name as name, t.active as active, t.displayID as displayID, d.name as division from teams t, seasons s, inDivision inD, divisions d where t.active = true and t.teamID = inD.teamID and s.year = inD.year and inD.division = d.divisionID and s.active = 1 order by displayID";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

// Get team by TeamID
exports.getTeamByID = function(teamID, callback) {
  var sql = "select * from teams where teamID = " + teamID;
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

// Get Team Name By teamID
exports.getTeamNameByID = function(teamID, callback) {
  var sql = "select name from teams where teamID = " + teamID;
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};


//
//
// Schedule Queries
//
// Get full Schedule
exports.getScheduleActive = function(callback) {
  var sql = "select g.gameID as gameID, s.year as year, awayT.teamID as awayTeamID, awayT.DisplayID as awayTeamDisplayID, awayT.name as awayTeamName, homeT.teamID as homeTeamID, homeT.displayID as homeTeamDisplayID, homeT.name as homeTeamName, f.fieldID as fieldID, f.name as fieldName, g.dateTime as 'dateTime', g.status as status, g.type as type, sc.awayScore, sc.homeScore from games g left outer join (select * from scores where status = 'approved') sc on g.gameID = sc.gameID, seasons s, teams awayT, teams homeT, fields f where g.year = s.year and g.awayTeamID = awayT.teamID and g.homeTeamID = homeT.teamID and g.fieldID = f.fieldID and s.active = true order by g.dateTime";
  console.log(sql);
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

// Get Schedule by TeamID
exports.getScheduleByTeamId = function(teamID, callback) {
  console.log("TeamID: " + teamID);
  var sql = "select g.gameID as gameID, s.year as year, awayT.teamID as awayTeamID, awayT.displayID as awayTeamDisplayID, awayT.name as awayTeamName, homeT.teamID as homeTeamID, homeT.displayID as homeTeamDisplayID, homeT.name as homeTeamName, f.fieldID as fieldID, f.name as fieldName, g.dateTime as 'dateTime', g.status as status, g.type as type, sc.awayScore, sc.homeScore from games g left outer join scores sc on g.gameID = sc.gameID, seasons s, teams awayT, teams homeT, fields f where g.year = s.year and g.awayTeamID = awayT.teamID and g.homeTeamID = homeT.teamID and g.fieldID = f.fieldID and s.active = true and (g.awayTeamID = "+teamID+" or g.homeTeamID = "+teamID+") order by g.dateTime;";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};
// Get Schedule -- Next 2 weeks
exports.getScheduleNext2Weeks = function(callback) {
  /*var today = new Date();
  if(today.getMonth() == 2){
    if(today.getDate() > 14){
      future = today.getFullYear() + "-" + today.getMonth()+2 + "-" + today.getDate()-14;
    }
    else {
      future = today.getFullYear() + "-" + today.getMonth()+1 + "-" + today.getDate()+14;
    }
  }
  else if(today.getMonth() == 11){ // December
    if(today.getDate() > 17){
      future = today.getFullYear()+1 + "-" + 1 + "-" + today.getDate()-17;
    }
    else {
      future = today.getFullYear() + "-" + today.getMonth()+1 + "-" + today.getDate()+14;
    }
  }
  else if(today.getMonth() == 0, 2, 4, 6, 7, 9 ){ // Months with 31 (except December)
    if(today.getDate() > 17){
      future = today.getFullYear() + "-" + today.getMonth()+2 + "-" + today.getDate()-17;
    }
    else {
      future = today.getFullYear() + "-" + today.getMonth()+1 + "-" + today.getDate()+14;
    }
  }
  else if(today.getMonth() == 1, 3, 5, 8, 10){
    if(today.getDate() > 16) {
      future = today.getFullYear() + "-" + today.getMonth()+2 + "-" + today.getDate()-16;
    }
    else {
      future = today.getFullYear() + "-" + today.getMonth()+1 + "-" + today.getDate()+14;
    }
  }
  var today = today.getFullYear() + "-" + today.getMonth()+1 + "-" + + today.getDate();
  */
var today = "2016-01-01";
var future = "2016-02-02";
var sql = "SELECT g.dateTime as dateTime, f.name as fieldName, tAway.name as awayName, tHome.name as homeName FROM games g, fields f, teams tAway, teams tHome WHERE g.fieldID = f.fieldID and g.awayTeamID = tAway.teamID and g.homeTeamID = tHome.teamID and dateTime BETWEEN '" + today+"' AND '" + future + "' AND status='notPlayed' order by g.dateTime";

  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, results) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      console.log("no errors");
      callback(true, results);
    });
  });
};
// Get Schedule by Month
exports.getScheduleByMonth = function(month, callback) {
  console.log("working in getScheduleByMonth DB function");
  var monthInt = 0;
  switch(month){
    case "May":
      monthInt = 5;
      break;
    case "June":
      monthInt = 6;
      break;
    case "July":
      monthInt = 7;
      break;
    case "August":
      monthInt = 8;
      break;
    case "September":
      monthInt = 9;
      break;
  }
  var sql = "select g.gameID as gameID, s.year as year, awayT.teamID as awayTeamID, awayT.displayID as awayTeamDisplayID, awayT.name as awayTeamName, homeT.teamID as homeTeamID, homeT.displayID as homeTeamDisplayID, homeT.name as homeTeamName, f.fieldID as fieldID, f.name as fieldName, g.dateTime as 'dateTime', g.status as status, g.type as type, sc.awayScore as awayScore, sc.homeScore as homeScore from games g left outer join scores sc on g.gameID = sc.gameID, seasons s, teams awayT, teams homeT, fields f where g.year = s.year and g.awayTeamID = awayT.teamID and g.homeTeamID = homeT.teamID and g.fieldID = f.fieldID and s.active = true and month(g.dateTime) = "+monthInt+" order by g.dateTime;";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

//
// Standings Queries
//
exports.getStandings = function(callback) {
  var sql = "select s.status as status, s.awayScore as awayScore, s.homeScore as homeScore, teamAway.teamID as awayID, teamAway.name as awayName, teamAway.displayID as awayDisplayID, teamHome.teamID as homeID, teamHome.name as homeName, teamHome.displayID as homeDisplayID from scores s, games g, teams teamAway, teams teamHome, seasons where s.gameID = g.gameID and g.awayTeamID = teamAway.teamID and g.homeTeamID = teamHome.teamID and seasons.active = 1 and seasons.year = g.year;";
  console.log("calling sql");
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

//
// Games Queries
//
exports.getGameByID = function(gameID, callback) {
  var sql = "select g.gameID as gameID, g.year, g.awayTeamID as awayTeamID, tAway.name as awayName, tAway.displayID as awayDisplayID, g.homeTeamID as homeTeamID, tHome.name as homeName, tHome.displayID as homeDisplayID, g.fieldID, f.name, g.dateTime, g.status, g.type from games g, teams tAway, teams tHome, fields f where g.gameID = " + gameID + " and g.awayTeamID = tAway.teamID and g.homeTeamID = tHome.teamID and g.fieldID = f.fieldID;";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

//
// Scores Queries
//
exports.getScoresByGameID = function(gameID, callback) {
  var sql = "select s.scoreID, s.gameID, s.reportedByUserID, u.displayName, s.awayScore, s.homeScore, s.status from scores s, users u where gameID = " + gameID + " and s.reportedByUserID = u.userID;";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, rows) {
      connection.release();
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};

//
// Manage API Functions
//
exports.updateGameStatus = function(gameID, callback) {
  var sql = "update games set status = 'played' where gameID = " + gameID + ";";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, rows) {
      if(err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};
exports.insertScore = function(gameID, awayScore, homeScore, userID, callback) {
  console.log("inside db.insertScore");
  var sql = "insert into scores (gameID, reportedByUserID, awayScore, homeScore, status) values ("+gameID+", "+userID+", "+awayScore+", "+homeScore+", 'pending');";
  console.log("SQL: " + sql);
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(false);
      return;
    }
    connection.query(sql, function(err, rows) {
      if (err) {
        console.log(err);
        callback(false);
        return;
      }
      callback(true, rows);
    });
  });
};
exports.approveScore = function(gameID, scoreID, callback) {
  console.log("gameID: " + gameID);
  console.log("scoreID: " + scoreID);

  var sql1 = "update scores set status = 'pending' where gameID = " + gameID + ";";
  console.log("sql1: " + sql1);

  pool.getConnection(function(err, connection) {
    if (err) {
      callback(false);
      return;
    }
    connection.query(sql1, function(err, rows) {
      if (err) {
        callback(false);
        return;
      }

      console.log(err);
      console.log(rows);

      var sql = "update scores set status = 'approved' where scoreID = " + scoreID + ";";
      console.log("SQL: " + sql);
      pool.getConnection(function(err, connection) {
        if(err) {
          console.log(err);
          callback(false);
          return;
        }
        connection.query(sql, function(err, rows) {
          if (err) {
            console.log(err);
            callback(false);
            return;
          }
          callback(true, rows);
        });
      });
    });
  });
};
