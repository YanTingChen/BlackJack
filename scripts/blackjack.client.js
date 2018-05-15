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