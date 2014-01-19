
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var simpledb = require('mongoose-simpledb');

var db = simpledb.init();

var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * GET home page.
 */

app.get('/', function(req, res) {
    db.Kitten.findOne({ 'name.first': 'Koda' }, function (err, koda) {
        if (err) return console.error(err);
        if (!koda) return console.error(new Error("No document found."));
        res.render('index', { koda: koda, title: 'node mongodb 101' });
    });
});

app.post('/createKitten', function (req, res) {
    db.Kitten.findById(req.param('_id'), function (err, koda) {
        if (err) return console.error(err);
        if (!koda) return res.send("Could not find kitten...");
        koda.name.first = req.param('firstName');
        koda.name.last = req.param('lastName');
        koda.age = parseInt(req.param('age'));
        koda.save();
        res.render('index', { koda: koda, title: 'Koda bug saved!' });
    });
});

http.createServer(app).listen(process.env.PORT || 3000, function(){
  console.log('Express server listening on port 3000');
});
