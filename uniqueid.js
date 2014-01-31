var makeid = require('./makeid');
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

var uniqueId = function uniqueId(length, callback){
    var id = makeid(length);
    redis.exists(id, function(key){
        if (key == true){
            uniqueId(length, callback);
        } else {
            callback(id);
        }
    });
};

module.exports = uniqueId