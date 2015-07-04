var StockInfo = require('./main.js');
var defauleStockinfo 
var init = function (server) {
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        socket.on('say', function (words) {
            if (typeof words !== 'string') return;
            socket.broadcast.emit('said', words);
            console.log('some one said', words);
        });
        //console.log('some one login');
    });
    setInterval(function () {
        StockInfo.GetStockInfo('sh000001', 'minute', function (err, result) {
            if (err) return;
            if (result) io.emit('stockinfo', { code: 'sh000001', info: result });
        });
    }, 1000 * 10);
};
module.exports = function (server) { init(server); };