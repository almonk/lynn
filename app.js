/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var makeid = require('./makeid');
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

base_url = "http://almonk.com"

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    base_url = "http://0.0.0.0:3000/"
}


app.get('/shorten', function(req, res){
    shortened_id = makeid();

    // Save to redis
    redis.set(shortened_id, req.query.url);

    res.send(
        {
            shortened_url: base_url + shortened_id
        }
    );
});

app.get('/', function(req, res){
    res.redirect("http://alasdairmonk.com");
});

app.get('/:id', function(req, res){
    console.log("Lookup " + req.params.id);

    redis.get(req.params.id, function (err, value) {
        console.log("Found " + value.toString());
        res.redirect(value.toString());
    });
});

app.put('/edit/:id', function(req, res){
    console.log("Lookup " + req.param("url"));

    var new_url = req.param("url");

    redis.set(req.params.id, req.param("url"));

    res.send(
        {
            shortened_url: base_url + req.params.id
        }
    );
});


http.createServer(app).listen(app.get('port'), function(){
    console.log("Lynn's a good worker");
});
