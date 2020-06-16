var Client = require("./client");
var AEUIS_PATH = "aeuis";

function Aeuis(){
}

Aeuis.list = function(client, query, callback){
    if(arguments.length === 2){
        callback = query;
        query = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(AEUIS_PATH), query, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = Aeuis.prototype;
        callback(null, res);
    });
};

Aeuis.get = function(client, acid, callback){
    if(arguments.length === 2){
        callback = acid;
        acid = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(AEUIS_PATH) + `/${acid}`, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = Aeuis.prototype;
        callback(null, res);
    });
};

module.exports = Aeuis;