(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var App = {}

App.deal = function () {
    var self = this;
    self.clientSocket.dealEmit();
    // App.socket.emit('deal');
}

App.hit = function () {
    var self = this;
    self.clientSocket.hitEmit();
    // App.socket.emit('hit');
}

App.stand = function () {
    var self = this;
    self.clientSocket.standEmit();
    // App.socket.emit('stand');
}

App.getSuitHtml = function (suit) {
    var htmlEntities = {
        'H': '&#9829;',
        'D': '&#9830;',
        'C': '&#9827;',
        'S': '&#9824;'
    }
    var image = htmlEntities['C'];
    if (suit === 'H') {
        image = htmlEntities['H'];
    } else if (suit === 'S') {
        image = htmlEntities['S'];
    } else if (suit === 'D') {
        image = htmlEntities['D'];
    }
    return image;
}

App.getRankHtml = function (rank) {
    if (rank === 1) {
        return 'A';
    } else if (rank === 11) {
        return 'J';
    } else if (rank === 12) {
        return 'Q';
    } else if (rank === 13) {
        return 'K';
    }
    return rank;
}

App.getCardsHtml = function (cards) {
    var html = '';
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        html += App.getSuitHtml(card.suit);
        html += App.getRankHtml(card.rank);
    }
    return html;
}

App.updatePlayer = function (player) {
    $('#playerCards').html(App.getCardsHtml(player.cards));
    $('#playerScore').text(player.score);
}

App.updateDealer = function (dealer) {
    $('#dealerCards').html(App.getCardsHtml(dealer.cards));
    $('#dealerScore').text(dealer.score);
}

App.updateResult = function (result) {
    var displayResult = result;
    if (result === 'None') {
        displayResult = '';
    }
    $('#result').text(displayResult);
}

App.disableButton = function (id) {
    $(id).attr('disabled', 'disabled');
}

App.enableButton = function (id) {
    $(id).removeAttr('disabled');
}

App.disableDeal = function () {
    App.disableButton('#deal');
    App.enableButton('#hit');
    App.enableButton('#stand');
}

App.enableDeal = function () {
    App.enableButton('#deal');
    App.disableButton('#hit');
    App.disableButton('#stand');
}

App.enableDealIfGameFinished = function (result) {
    if (result !== 'None') {
        App.enableDeal();
    }
}

App.dealResult = function (game) {
    App.disableDeal();
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
}

App.hitResult = function (game) {
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
    App.enableDealIfGameFinished(game.result);
}

App.standResult = function (game) {
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
    App.enableDealIfGameFinished(game.result);
}

// App.socket = {}

App.registerClientActions = function () {

    $('#deal').click(function () {
        App.deal();
    });

    $('#hit').click(function () {
        App.hit();
    });

    $('#stand').click(function () {
        App.stand();
    });
}

//listen on event
App.registerServerActions = function () {
    var self = this;
    self.clientSocket.dealOn(App.dealResult);
    self.clientSocket.hitOn(App.hitResult);
    self.clientSocket.standOn(App.standResult);
    // App.socket.on('deal', function (game) {
    //     App.dealResult(game);
    // });
    // App.socket.on('hit', function (game) {
    //     App.hitResult(game);
    // });
    // App.socket.on('stand', function (game) {
    //     App.standResult(game);
    // });
}

App.init = function () {
    var clientSocket = require('./socket.client');
    // var socket = io.connect('http://localhost:8080');
    // App.socket = socket;
    var self = this;
    // App.socket = clientSocket.events.socket;
    self.clientSocket = clientSocket.events();
    App.registerClientActions();
    App.registerServerActions();
    App.enableDeal();
}

$(document).ready(function () {
    App.init();
});
},{"./socket.client":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
