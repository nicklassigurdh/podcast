var theLog = [];

var log = function () {};

log.add = function (data) {
    theLog.push(data);
}

log.get = function () {
    return JSON.stringify(theLog);
}

module.exports = log;