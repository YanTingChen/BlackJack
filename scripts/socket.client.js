function socketEvents() {
    var self = this;
    var socket = io.connect('http://localhost:8080');
    self.socket = socket;
}

//deal
socketEvents.prototype.dealEmit = function () {
    var self = this;
    self.socket.emit('deal');
}

//hit
socketEvents.prototype.hitEmit = function () {
    var self = this;
    self.socket.emit('hit');
}

//stand
socketEvents.prototype.standEmit = function () {
    var self = this;
    self.socket.emit('stand');
}

//deal data
socketEvents.prototype.dealOn = function (callback) {
    var self = this;
    self.socket.on('deal', function (data) {
        // console.log('deal data : ' + data);
        if (callback) callback(data);
    });
}

//hit data
socketEvents.prototype.hitOn = function (callback) {
    var self = this;
    self.socket.on('hit', function (data) {
        // console.log('hit data : ' + data);
        if (callback) callback(data);
    });
}

//stand data
socketEvents.prototype.standOn = function (callback) {
    var self = this;
    self.socket.on('stand', function (data) {
        // console.log('stand data : ' + data);
        if (callback) callback(data);
    });
}

function events() {
    return new socketEvents();
}

exports.events = events