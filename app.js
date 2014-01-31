/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var uniqueId = require('./uniqueid');
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


base_url = "http://almonk.com/" // Must end with '/'

app.get('/', function(req, res){
    res.redirect("http://alasdairmonk.com");
});

app.get('/shorten', function(req, res){
    uniqueId(5, function(shortened_id){
        // Save to redis
        redis.set(shortened_id, req.query.url);

        res.send(
            {
                shortened_url: base_url + shortened_id,
                edit_token: makeid(22)
            }
        );
    })
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
