var express = require('express');
var router = express.Router();

/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/seasons', function(req, res, next) {
  res.send('blah blah blah');
});

module.exports = router;
