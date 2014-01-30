/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

base_url = "http://almonk.com/"

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

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

http.createServer(app).listen(app.get('port'), function(){
    console.log("Lynn's a good worker");
});
