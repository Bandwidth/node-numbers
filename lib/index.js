var Promise = require("bluebird");

var Account = require("./account");
Promise.promisifyAll(Account);

var AvailableNpaNxx = require("./availableNpaNxx");
Promise.promisifyAll(AvailableNpaNxx);

var AvailableNumbers = require("./availableNumbers");
Promise.promisifyAll(AvailableNumbers);

var City = require("./city");
Promise.promisifyAll(City);

var CoveredRateCenter = require("./coveredRateCenter");
Promise.promisifyAll(CoveredRateCenter);

var DiscNumber = require("./discNumber");
Promise.promisifyAll(DiscNumber);

var Disconnect = require("./disconnect");
Promise.promisifyAll(Disconnect);
Promise.promisifyAll(Disconnect.prototype);

var Dlda = require("./dlda");
Promise.promisifyAll(Dlda);
Promise.promisifyAll(Dlda.prototype);

var ImportToAccount = require("./importToAccount");
Promise.promisifyAll(ImportToAccount);
// Promise.promisifyAll(ImportToAccount.prototype);

var InServiceNumber = require("./inServiceNumber");
Promise.promisifyAll(InServiceNumber);

var Lidbs = require("./lidbs");
Promise.promisifyAll(Lidbs);

var LnpChecker = require("./lnpChecker");
Promise.promisifyAll(LnpChecker);

var LsrOrder = require("./lsrOrder");
Promise.promisifyAll(LsrOrder);
Promise.promisifyAll(LsrOrder.prototype);

var Order = require("./order");
Promise.promisifyAll(Order);
Promise.promisifyAll(Order.prototype);

var PortIn = require("./portIn");
Promise.promisifyAll(PortIn);
Promise.promisifyAll(PortIn.prototype);

var PortOut = require("./portOut");
Promise.promisifyAll(PortOut);
Promise.promisifyAll(PortOut.prototype);

var RateCenter = require("./rateCenter");
Promise.promisifyAll(RateCenter);

var SipPeer = require("./sipPeer");
Promise.promisifyAll(SipPeer);
Promise.promisifyAll(SipPeer.prototype);

var Site = require("./site");
Promise.promisifyAll(Site);
Promise.promisifyAll(Site.prototype);

var Subscription = require("./subscription");
Promise.promisifyAll(Subscription);
Promise.promisifyAll(Subscription.prototype);

var Tn = require("./tn");
Promise.promisifyAll(Tn);
Promise.promisifyAll(Tn.prototype);

var TnReservation = require("./tnReservation");
Promise.promisifyAll(TnReservation);
Promise.promisifyAll(TnReservation.prototype);

var User = require("./user");
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

var Client = require("./client");

module.exports = {
  Client,
  Site,
  SipPeer,
  Subscription,
  RateCenter,
  Tn,
  TnReservation,
  PortIn,
  PortOut,
  ImportToAccount,
  Order,
  LnpChecker,
  Disconnect,
  City,
  AvailableNumbers,
  AvailableNpaNxx,
  CoveredRateCenter,
  User,
  Account,
  InServiceNumber,
  DiscNumber,
  LsrOrder,
  Lidbs,
  Dlda,
};
