/**
 * Created by tigou on 2015/7/1.
 */
$(function() {
    var init = stockAnimate({
        containt:$('#box'),//动画的容器*必填
        type:0,//动画方式0为随机，其它特定1-5
        count:10,//显示几行
        isqita:true,//是否显示其他玩家文字漂浮
        time:3000//动画时间
    });
    var socket = io();
    var btn = document.getElementById("btn");
    btn.onclick = function() {
        var content = document.getElementById("content").value;
        if(content) {
            setContent(content);
            document.getElementById("content").value = '';
        }
    };
    function setContent(cont) {
        init.start(cont);
        socket.emit('say', cont);
    }
    socket.on('said', function (words) {
        init.start(words);
    });
    socket.on('stockinfo', function (obj) {
        if(obj.info) {
            var data = obj.info.replace(/n/g,'-').replace(/\n/g,'').split('\\-\\');
            $.each(data,function(i,v) {
                data[i] = v.split(' ');
                data[i][data[i].length - 1] = data[i].splice(0, 1, data[i][data[i].length - 1])[0];
                if(data[i][2]) {
                    data[i][2] = getTime(data[i][2]);
                }
                $.each(data[i],function(k,c) {
                    data[i][k] = Number(c);
                });
            });
            //data = data;.replace(/↵/g,'')
            data.shift();
            data.shift();
            data.pop();
            console.log(data);
            setChart(data);
        }
    });
    function setChart(data) {
        $('#myChart').highcharts('StockChart', {
            rangeSelector : {
                enabled : false
            },
            navigator : {
                enabled : false
            },
            scrollbar : {
                enabled : false
            },
            exporting : {
                enabled : false
            },
            title : {
                text : '123456'
            },
            credits : {
                enabled : false
            },
            series : [{
                name : '市值',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    }
});

function stockAnimate(obj) {//股票弹幕动画
    var init = new Object();
    init.containt = obj.containt;
    init.type = obj.type;
    init.getRandomColor = function() {
        return  '#' +
            (function(color){
                return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
                    && (color.length == 6) ?  color : arguments.callee(color);
            })('');
    }
    init.size = function() {
       return Math.round(Math.random()*50 + 18);
    };
    init.type = obj.type || 0;
    init.time = obj.time || 3000;
    init.len = obj.count || 10;
    init.start = function(cont) {
        var count = Math.round(Math.random()*(init.len - 1) + 1);
        var type = 0;
        if(init.type == 0) {
            type = Math.round(Math.random()*4 + 1);
        } else {
            type = init.type;
        }
        init.containt.append('<div class="move">' + cont + '</div>');
        var _this = init.containt.find('.move:last');
        switch(type) {
            case 1://右飘移
                var h = init.containt.height()*count/init.len;
                _this.css({
                    "color":init.getRandomColor,
                    "font-size":init.size
                });
                if(h < (init.containt.height() -  _this.height())) {
                    _this.css({
                        "top":h,
                        "left":-_this.width()
                    });
                } else {
                    _this.css({
                        "bottom":"0px",
                        "left":-_this.width()
                    });
                }
                _this.animate({left:(_this.width() + init.containt.width())},init.time,function() {
                    _this.remove();
                });
                break;
            case 2://左飘移
                var h = init.containt.height()*count/init.len;
                _this.css({
                    "color":init.getRandomColor,
                    "font-size":init.size
                });
                if(h < (init.containt.height() -  _this.height())) {
                    _this.css({
                        "top":h,
                        "right":-_this.width()
                    });
                } else {
                    _this.css({
                        "bottom":"0px",
                        "right":-_this.width()
                    });
                }
                _this.animate({right:(_this.width() + init.containt.width())},init.time,"linear",function() {
                    _this.remove();
                });
                break;
            case 3://固定位置
                var h = init.containt.height()*count/init.len;
                _this.css({
                    "color":init.getRandomColor,
                    "font-size":init.size,
                    "width":init.containt.width()
                });
                if(h < (init.containt.height() -  _this.height())) {
                    _this.css({
                        "top":h
                    });
                } else {
                    _this.css({
                        "bottom":"0px"
                    });
                }
                _this.hide(init.time,function() {
                    _this.remove();
                });
                break;
            case 4://向上滚动
                _this.css({
                    "color":init.getRandomColor,
                    "font-size":init.size,
                    "width":init.containt.width()
                });
                _this.css("top",-_this.height());
                _this.animate({top:(_this.height() + init.containt.height())},init.time,"linear",function() {
                    _this.remove();
                });
                break;
            case 5://向下滚动
                _this.css({
                    "color":init.getRandomColor,
                    "font-size":init.size,
                    "width":init.containt.width()
                });
                _this.css("top",_this.height() + init.containt.height());
                _this.animate({top:-_this.height()},init.time,"linear",function() {
                    _this.remove();
                });
                break;
        }
    }
    return init;
}
function getTime(time) {
    var $data = new Date();
    var $year = $data.getFullYear();
    var $month = $data.getMonth() >= 9 ?($data.getMonth() + 1):"0" + ($data.getMonth() + 1);
    var $date = $data.getDate() >= 10?$data.getDate():"0" + $data.getDate();
    var $s = time.substr(0,2);
    var $m = time.substr(2);
    var t = $year + '-' + $month + '-' + $date + ' ' + $s + ':' + $m + ':00';
    return new Date(t).getTime();
}
