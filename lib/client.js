var superagent = require("superagent");
var xml2js = require("xml2js");
var errors = require("./errors");
const {
  fixPath,
  findFirstDescendant,
  findDescendants,
  prepareToBuildXml,
  transformParsedObject,
  customTags,
  setAuth
} = require("./clientUtils");

class Client {
  constructor (
    accountId = Client.globalOptions.accountId,
    userName = Client.globalOptions.userName,
    password = Client.globalOptions.password,
    clientId = Client.globalOptions.clientId,
    clientSecret = Client.globalOptions.clientSecret,
    options = {}
  ) {
    console.log("Creating client for accountId: " + accountId);
    if (!options.apiEndPoint) {
      options.apiEndPoint = Client.globalOptions.apiEndPoint;
    }
    this.accountId = accountId;
    this.userName = userName;
    this.password = password;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.apiEndPoint = options.apiEndPoint;
    this.tempAccessToken = options.tempAccessToken || null;
    this.tempAccessTokenExpiration = options.tempAccessTokenExpiration || null;
    this.xml2jsParserOptions = {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.firstCharLowerCase, customTags],
      async: true
    };
  }

  static getIdFromHeader (header, callback) {
    var index = location.lastIndexOf("/");
    if(index < 0){
      return callback(new Error("Missing id in response"));
    }
    var id = location.substr(index + 1);
    callback(null, id);
  }

  static getIdFromLocationHeader (location, callback) {
    var index = location.lastIndexOf("/");
    if(index < 0){
      return callback(new Error("Missing id in response"));
    }
    var id = location.substr(index + 1);
    callback(null, id);
  }

  async prepareRequest (req) {
    const now = Math.floor(Date.now() / 1000);
    console.log("Preparing request at time: " + now);
    console.log("Current access token: " + this.tempAccessToken);
    if (this.tempAccessToken && (!this.tempAccessTokenExpiration || this.tempAccessTokenExpiration > now + 60)) {
      console.log("Using existing access token");
      req.auth(this.tempAccessToken, { type: "bearer" });
    } else if (this.clientId && this.clientSecret) {
      console.log("Requesting new access token");
      const tokenResponse = await superagent
        .post('https://api.bandwidth.com/api/v1/oauth2/token')
        .type('form')
        .auth(this.clientId, this.clientSecret)
        .send({ grant_type: 'client_credentials' });
      
      req.auth(tokenResponse.body.access_token, { type: "bearer" });
      this.tempAccessToken = tokenResponse.body.access_token;
      console.log("Received access token: " + tokenResponse.body.access_token);
      console.log("Set access token: " + this.tempAccessToken);
      this.tempAccessTokenExpiration = now + tokenResponse.body.expires_in;
    } else if (this.userName && this.password) {
      req.auth(this.userName, this.password);
    } else {
      throw new Error("No authentication method available");
    }
    return req.set("User-Agent", "node-numbers");
  }

  concatAccountPath (path) {
    return `/accounts/${this.accountId}${fixPath(path)}`
  }
  
  prepareUrl (path) {
    return this.apiEndPoint + fixPath(path);
  }

  async createGetRequest (path, query, id) {
    if (id) {
      path = `${path}/${id}`;
    }
    let request = await this.prepareRequest(superagent.get(this.prepareUrl(path)));
    if (query) {
      return request.query(query);
    }
    return request;
  }

  async _createPostOrPutRequest(method, path, data) {
    const request = await this.prepareRequest(superagent[method](this.prepareUrl(path)));
    if (data) {
      const requestBody = this.buildXml(data);
      return request.send(requestBody).type("application/xml");
    }
    return request;
  }

  createPostRequest (path, data) {
    return this._createPostOrPutRequest("post", path, data);
  }

  createPutRequest (path, data) {
    return this._createPostOrPutRequest("put", path, data);
  }

  async createDeleteRequest (path) {
    return await this.prepareRequest(superagent.del(this.prepareUrl(path)));
  }

  async makeRequest (method) {
    var callback = arguments[arguments.length - 1];
    var args = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
    try {
      var request = await this["create" + method[0].toUpperCase() + method.substr(1).toLowerCase() + "Request"].apply(this, args);
      const res = await request;
      this.checkResponse(res, callback);
    } catch (err) {
      return callback(err);
    }
  }

  checkResponse (res, callback) {
    let defaultHandler = function(parsedData){
      if (!res.ok) {
        return callback(new errors.BandwidthError("", "Http code " + res.status, res.status));
      }
      return callback(null, parsedData || {});
    };

    if (res === null) {
      return callback(null);
    }

    else if (typeof res.body !== "undefined" && res.body.length > 0) {
      this.parseXml(res.body, function(err, r) {
        if (err) {
          return callback(err);
        }
        let keys = Object.keys(r);
        let result = (keys.length == 1) ? r[keys[0]] : r;
        let code = findFirstDescendant(r, "errorCode");
        let description = findFirstDescendant(r, "description");
        if (!code) {
          let error = findFirstDescendant(r, "error");
          if (error) {
            code = error.code;
            description = error.description;
          } else {
            let errs =  findDescendants(r, "errors");
            if (errs.length === 0) {
              code = findFirstDescendant(r, "resultCode");
              description = findFirstDescendant(r, "resultMessage");
            } else {
              return callback(new errors.BandwidthMultipleError(errs.map(function(e){
                return new errors.BandwidthError(e.code, e.description, res.statusCode);
              })), result);
            }
          }
        }
        if (code && description && code !== "0") {
          return callback(new errors.BandwidthError(code, description, res.statusCode), result);
        }
        defaultHandler(result);
      });
    } else {
      defaultHandler();
    }
  }

  parseXml (xml, callback) {
    this.xml2jsParserOptions.async = true; // force parser to be async
    xml2js.parseString(xml, this.xml2jsParserOptions, function(err, res) {
      if (err) {
        return callback(err);
      }
      callback(null, transformParsedObject(res));
    });
  }

  buildXml (data) {
    var obj = prepareToBuildXml(data);
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    return xml;
  }
}

Client.globalOptions = {
  apiEndPoint: "https://dashboard.bandwidth.com/api",
  userName: "",
  password: "",
  clientId: "",
  clientSecret: "",
  accountId: ""
};

module.exports = Client;
