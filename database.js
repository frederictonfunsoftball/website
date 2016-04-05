var mysql = require('mysql');
var pool;

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
    debug: true
  });
}
else if (env == "openShiftDev")
{
  pool = mysql.createPool({
    connectoinLimit: 100,
    host: process.env.OPENSHIFT_MYSQL_DB_HOST,
    port: process.env.OPENSHIFT_MYSQL_DB_PORT,
    user: 'adminRP7uRiv',
    password: 'P53nEKwRX_tE',
    database: 'softballdev',
    debug: true
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
    database: 'website',
    debug: false
  });
}

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
        callback(false);
        return;
      }
      callback(true, rows);
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
  var sql = "select t.teamID as teamID, t.name as name, t.active as active, t.displayID as displayID, d.name as division from teams t, seasons s, inDivision inD, divisions d where t.active = true and t.teamID = inD.teamID and s.year = inD.year and inD.division = d.divisionID";
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
//
// Schedule Queries
//
// Get full Schedule
exports.getScheduleActive = function(callback) {
  var sql = "select g.gameID as gameID, s.year as year, awayT.teamID as awayTeamID, awayT.DisplayID as awayTeamDisplayID, awayT.name as awayTeamName, homeT.teamID as homeTeamID, homeT.displayID as homeTeamDisplayID, homeT.name as homeTeamName, f.fieldID as fieldID, f.name as fieldName, g.dateTime as 'dateTime', g.status as status, g.type as type from games g, seasons s, teams awayT, teams homeT, fields f where g.year = s.year and g.awayTeamID = awayT.teamID and g.homeTeamID = homeT.teamID and g.fieldID = f.fieldID and s.active = true ";
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
  var sql = "select g.gameID as gameID, s.year as year, awayT.teamID as awayTeamID, awayT.displayID as awayTeamDisplayID, awayT.name as awayTeamName, homeT.teamID as homeTeamID, homeT.displayID as homeTeamDisplayID, homeT.name as homeTeamName, f.fieldID as fieldID, f.name as fieldName, g.dateTime as 'dateTime', g.status as status, g.type as type from games g, seasons s, teams awayT, teams homeT, fields f where g.year = s.year and g.awayTeamID = awayT.teamID and g.homeTeamID = homeT.teamID and g.fieldID = f.fieldID and s.active = true and (g.awayTeamID = "+teamID+" or g.homeTeamID = "+teamID+");";
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
  var sql = "select g.gameID as gameID, s.year as year, awayT.teamID as awayTeamID, awayT.displayID as awayTeamDisplayID, awayT.name as awayTeamName, homeT.teamID as homeTeamID, homeT.displayID as homeTeamDisplayID, homeT.name as homeTeamName, f.fieldID as fieldID, f.name as fieldName, g.dateTime as 'dateTime', g.status as status, g.type as type from games g, seasons s, teams awayT, teams homeT, fields f where g.year = s.year and g.awayTeamID = awayT.teamID and g.homeTeamID = homeT.teamID and g.fieldID = f.fieldID and s.active = true and month(g.dateTime) = " + monthInt;
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
  var sql = "select s.status as status, s.awayScore as awayScore, s.homeScore as homeScore, teamAway.teamID as awayID, teamAway.name as awayName, teamAway.displayID as awayDisplayID, teamHome.teamID as homeID, teamHome.name as homeName, teamHome.displayID as homeDisplayID from scores s, games g, teams teamAway, teams teamHome where s.gameID = g.gameID and g.awayTeamID = teamAway.teamID and g.homeTeamID = teamHome.teamID;";
  console.log("calling sql");
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
