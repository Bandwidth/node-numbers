var Client = require("./client");
var EMERGENCY_NOTIFICATION_RECIPIENTS = "emergencyNotificationRecipients";
var EMERGENCY_NOTIFICATION_GROUP_ORDERS = "emergencyNotificationGroupOrders";
var EMERGENCY_NOTIFICATION_GROUPS = "emergencyNotificationGroups";
var EMERGENCY_NOTIFICATION_ENDPOINT_ORDERS = "emergencyNotificationEndpointOrders";

function EmergencyNotification(){
}


EmergencyNotification.listRecipients = function(client, query, callback){
    if(arguments.length === 2){
        callback = query;
        query = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_RECIPIENTS), query, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.getRecipient = function(client, enrid, callback){
    if(arguments.length === 2){
        callback = enrid;
        enrid = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_RECIPIENTS) + `/${enrid}`,  function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.createRecipient = function(client, recipient, callback){
    if(arguments.length === 2){
        callback = recipient;
        recipient = client;
        client = new Client();
    }
    client.makeRequest("post", client.concatAccountPath(EMERGENCY_NOTIFICATION_RECIPIENTS), recipient, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.prototype.replaceRecipient = function(client, recipient, callback){
    if(arguments.length === 2){
        callback = recipient;
        recipient = client;
        client = new Client();
    }

    client.makeRequest("put", client.concatAccountPath(EMERGENCY_NOTIFICATION_RECIPIENTS) + `/${this.enrid}`, recipient, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.prototype.deleteRecipient = function(client, callback){
    if(arguments.length === 1){
        callback = client;
        client = new Client();
    }

    client.makeRequest("put", client.concatAccountPath(EMERGENCY_NOTIFICATION_RECIPIENTS) + `/${this.enrid}`, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.listGroupOrders = function(client, query, callback){
    if(arguments.length === 2){
        callback = query;
        query = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_GROUP_ORDERS), query, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.getGroupOrder = function(client, orderId, callback){
    if(arguments.length === 2){
        callback = orderId;
        orderId = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_GROUP_ORDERS) + `/${orderId}`, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.createGroupOrder = function(client, groupOrder, callback){
    if(arguments.length === 2){
        callback = groupOrder;
        groupOrder = client;
        client = new Client();
    }
    client.makeRequest("post", client.concatAccountPath(EMERGENCY_NOTIFICATION_GROUP_ORDERS), groupOrder, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.getGroup = function(client, engid, callback){
    if(arguments.length === 2){
        callback = engid;
        engid = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_GROUPS) + `/${engid}`, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.listGroups = function(client, query, callback){
    if(arguments.length === 2){
        callback = query;
        query = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_GROUPS), query, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.listEnpointOrders = function(client, query, callback){
    if(arguments.length === 2){
        callback = query;
        query = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_ENDPOINT_ORDERS), query, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.getEndpointOrder = function(client, engId, callback){
    if(arguments.length === 2){
        callback = engId;
        engId = client;
        client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(EMERGENCY_NOTIFICATION_ENDPOINT_ORDERS) + `/${engId}`, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};

EmergencyNotification.createEndpointOrder = function(client, endpointOrder, callback){
    if(arguments.length === 2){
        callback = endpointOrder;
        endpointOrder = client;
        client = new Client();
    }
    client.makeRequest("post", client.concatAccountPath(EMERGENCY_NOTIFICATION_ENDPOINT_ORDERS), endpointOrder, function(err, res){
        if(err){
            return callback(err);
        }
        res.client = client;
        res.__proto__ = EmergencyNotification.prototype;
        callback(null, res);
    });
};



module.exports = EmergencyNotification;