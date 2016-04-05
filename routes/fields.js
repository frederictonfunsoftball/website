var express = require('express');
var router = express.Router();

var db = require('../database.js');

/* GET fields listing. */
router.get('/', function(req, res, next) {
  db.getFieldsActive(function(state, rows){
    console.log("State: " + state);
    console.log("numRows: " + rows.length);
    console.log("first row: " + rows[0].id);
    res.locals.fields = rows;
    next();
  });
},
function(req, res, next){
  res.render('fields');
});


module.exports = router;
