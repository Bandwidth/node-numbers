var superagent = require("superagent");
var xml2js = require("xml2js");
var errors = require("./errors");
const {
  fixPath,
  findFirstDescendant,
  findDescendants,
  prepareToBuildXml,
  transformParsedObject,
  customTags
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
    this.tokenRefreshTimer = null;
    this.tokenReadyPromise = null;
    this.autoRefreshToken = options.autoRefreshToken !== false;
    this.xml2jsParserOptions = {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.firstCharLowerCase, customTags],
      async: true
    };
    
    // Start background token refresh if using OAuth and auto-refresh is enabled
    if (this.autoRefreshToken && this.clientId && this.clientSecret && !this.tempAccessToken) {
      this.tokenReadyPromise = new Promise((resolve, reject) => {
        this._tokenReadyResolve = resolve;
        this._tokenReadyReject = reject;
      });
      // avoid an unhandled rejection if the fetch fails before any request awaits it
      this.tokenReadyPromise.catch(() => {});
      process.nextTick(() => this._refreshToken());
    }
  }

  _scheduleTokenRefresh () {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }

    const now = Math.floor(Date.now() / 1000);
    let refreshIn;

    if (this.tempAccessToken && this.tempAccessTokenExpiration) {
      const expiresIn = this.tempAccessTokenExpiration - now;
      refreshIn = Math.max((expiresIn - 300) * 1000, 0); // 5min before
    } else {
      refreshIn = 0;
    }

    this.tokenRefreshTimer = setTimeout(() => {
      this._refreshToken();
    }, refreshIn);
    
    // unref() so timer doesn't keep process alive
    if (this.tokenRefreshTimer.unref) {
      this.tokenRefreshTimer.unref();
    }
  }

  _refreshToken () {
    if (!this.clientId || !this.clientSecret) {
      if (this._tokenReadyReject) {
        this._tokenReadyReject(new Error("No OAuth credentials configured"));
        this._tokenReadyReject = null;
        this._tokenReadyResolve = null;
      }
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    
    superagent
      .post('https://api.bandwidth.com/api/v1/oauth2/token')
      .type('form')
      .auth(this.clientId, this.clientSecret)
      .send({ grant_type: 'client_credentials' })
      .then((tokenResponse) => {
        this.tempAccessToken = tokenResponse.body.access_token;
        this.tempAccessTokenExpiration = now + tokenResponse.body.expires_in;
        
        if (this._tokenReadyResolve) {
          this._tokenReadyResolve();
          this._tokenReadyResolve = null;
          this._tokenReadyReject = null;
          this.tokenReadyPromise = null;
        }
        
        this._scheduleTokenRefresh();
      })
      .catch((err) => {
        console.error("Token refresh failed:", err.message);
        
        if (this._tokenReadyReject) {
          this._tokenReadyReject(err);
          this._tokenReadyReject = null;
          this._tokenReadyResolve = null;
          this.tokenReadyPromise = null;
        }
        
        this.tokenRefreshTimer = setTimeout(() => {
          this._refreshToken();
        }, 30000);
        
        if (this.tokenRefreshTimer.unref) {
          this.tokenRefreshTimer.unref();
        }
      });
  }

  destroy () {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
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

  prepareRequest (req) {
    if (this.tempAccessToken) {
      req.auth(this.tempAccessToken, { type: "bearer" });
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

  createGetRequest (path, query, id) {
    if (id) {
      path = `${path}/${id}`;
    }
    let request = this.prepareRequest(superagent.get(this.prepareUrl(path)));
    if (query) {
      return request.query(query);
    }
    return request;
  }

  _createPostOrPutRequest(method, path, data) {
    const request = this.prepareRequest(superagent[method](this.prepareUrl(path)));
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

  createDeleteRequest (path) {
    return this.prepareRequest(superagent.del(this.prepareUrl(path)));
  }

  buildAuthenticatedRequest (buildRequest, callback) {
    const build = (tokenErr) => {
      let request;
      try {
        request = buildRequest();
      } catch (err) {
        return callback(tokenErr || err);
      }
      callback(null, request);
    };

    if (this.tokenReadyPromise) {
      this.tokenReadyPromise.then(() => build(), (err) => {
        console.error("Token fetch failed:", err);
        build(err);
      });
    } else {
      build();
    }
  }

  sendRequest (buildRequest, callback) {
    const execute = (isRetry) => {
      this.buildAuthenticatedRequest(buildRequest, (err, request) => {
        if (err) {
          return callback(err);
        }
        request.buffer().then((res) => callback(null, res), (err) => {
          if (!isRetry && this._canRefreshOn401(err)) {
            console.log("Got 401, refreshing token and retrying...");
            return this._forceTokenRefresh().then(() => execute(true), (refreshErr) => {
              console.error("Token refresh failed during retry:", refreshErr);
              callback(err);
            });
          }
          callback(err);
        });
      });
    };
    execute(false);
  }

  _canRefreshOn401 (err) {
    return err.status === 401 && this.autoRefreshToken && this.clientId && this.clientSecret;
  }

  _forceTokenRefresh () {
    this.tempAccessToken = null;
    this.tempAccessTokenExpiration = null;
    const tokenReadyPromise = new Promise((resolve, reject) => {
      this._tokenReadyResolve = resolve;
      this._tokenReadyReject = reject;
    });
    this.tokenReadyPromise = tokenReadyPromise;
    this._refreshToken();
    return tokenReadyPromise;
  }

  makeRequest (method) {
    const callback = arguments[arguments.length - 1];
    const args = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
    const createRequest = this["create" + method[0].toUpperCase() + method.substr(1).toLowerCase() + "Request"];

    this.sendRequest(() => createRequest.apply(this, args), (err, res) => {
      if (err) {
        return callback(err);
      }
      this.checkResponse(res, callback);
    });
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

    else if (typeof res.text !== "undefined" && res.text.length > 0) {
      this.parseXml(res.text, function(err, r) {
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
