var request = require('request');
exports.GetStockInfo = function (code, type, callback) {
    request.get('http://data.gtimg.cn/flashdata/hushen/' + type + '/' + code + '.js?' + Math.random(), {}, function (err, result) {
        callback(err, result.body);
    });
};