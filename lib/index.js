var Promise = require("bluebird");

module.exports = {
  Client: require("./client"),
  Site: require("./site"),
  SipPeer: require("./sipPeer"),
  Subscription: require("./subscription"),
  RateCenter: require("./rateCenter"),
  Tn: require("./tn"),
  TnReservation: require("./tnReservation"),
  PortIn: require("./portIn"),
  PortOut: require("./portOut"),
  ImportToAccount: require("./importToAccount"),
  Order: require("./order"),
  LnpChecker: require("./lnpChecker"),
  Disconnect: require("./disconnect"),
  City: require("./city"),
  AvailableNumbers: require("./availableNumbers"),
  AvailableNpaNxx: require("./availableNpaNxx"),
  CoveredRateCenter: require("./coveredRateCenter"),
  User: require("./user"),
  Account: require("./account"),
  InServiceNumber: require("./inServiceNumber"),
  DiscNumber: require("./discNumber"),
  LsrOrder: require("./lsrOrder"),
  Lidbs: require("./lidbs"),
  Dlda: require("./dlda"),
  ImportTnChecker: require("./importTnChecker"),
  ImportTnOrder: require("./importTnOrder"),
  RemoveImportedTnOrder: require("./removeImportedTnOrder"),
  CsrOrder: require("./csrOrder"),
  EmergencyNotification: require("./emergencyNotification"),
  Aeuis: require("./aeuis"),
  Application: require('./application'),
  Geocode: require('./geocode'),
  TnOption: require('./tnOption')
};

for (const property in module.exports) {
  Promise.promisifyAll(module.exports[property]);
  if (module.exports[property].hasOwnProperty("prototype")) {
    Promise.promisifyAll(module.exports[property].prototype);
  }
}
