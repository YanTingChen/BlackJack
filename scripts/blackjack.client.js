const clientSocket = require('./socket.client');

const App = {};

App.deal = function deal() {
  const self = this;
  self.clientSocket.dealEmit();
  // App.socket.emit('deal');
};

App.hit = function hit() {
  const self = this;
  self.clientSocket.hitEmit();
  // App.socket.emit('hit');
};

App.stand = function stand() {
  const self = this;
  self.clientSocket.standEmit();
  // App.socket.emit('stand');
};

App.getSuitHtml = function getSuitHtml(suit) {
  const htmlEntities = {
    H: '&#9829;',
    D: '&#9830;',
    C: '&#9827;',
    S: '&#9824;',
  };
  let image = htmlEntities.C;
  if (suit === 'H') {
    image = htmlEntities.H;
  } else if (suit === 'S') {
    image = htmlEntities.S;
  } else if (suit === 'D') {
    image = htmlEntities.D;
  }
  return image;
};

App.getRankHtml = function getRankHtml(rank) {
  if (rank === 1) {
    return 'A';
  } if (rank === 11) {
    return 'J';
  } if (rank === 12) {
    return 'Q';
  } if (rank === 13) {
    return 'K';
  }
  return rank;
};

App.getCardsHtml = function getCardsHtml(cards) {
  let html = '';
  for (let i = 0; i < cards.length; i += 1) {
    const card = cards[i];
    html += App.getSuitHtml(card.suit);
    html += App.getRankHtml(card.rank);
  }
  return html;
};

App.updatePlayer = function updatePlayer(player) {
  $('#playerCards').html(App.getCardsHtml(player.cards));
  $('#playerScore').text(player.score);
};

App.updateDealer = function updateDealer(dealer) {
  $('#dealerCards').html(App.getCardsHtml(dealer.cards));
  $('#dealerScore').text(dealer.score);
};

App.updateResult = function updateResult(result) {
  let displayResult = result;
  if (result === 'None') {
    displayResult = '';
  }
  $('#result').text(displayResult);
};

App.disableButton = function disableButton(id) {
  $(id).attr('disabled', 'disabled');
};

App.enableButton = function enableButton(id) {
  $(id).removeAttr('disabled');
};

App.disableDeal = function disableDeal() {
  App.disableButton('#deal');
  App.enableButton('#hit');
  App.enableButton('#stand');
};

App.enableDeal = function enableDeal() {
  App.enableButton('#deal');
  App.disableButton('#hit');
  App.disableButton('#stand');
};

App.enableDealIfGameFinished = function enableDealIfGameFinished(result) {
  if (result !== 'None') {
    App.enableDeal();
  }
};

App.dealResult = function dealResult(game) {
  App.disableDeal();
  App.updateDealer(game.dealer);
  App.updatePlayer(game.player);
  App.updateResult(game.result);
};

App.hitResult = function hitResult(game) {
  App.updateDealer(game.dealer);
  App.updatePlayer(game.player);
  App.updateResult(game.result);
  App.enableDealIfGameFinished(game.result);
};

App.standResult = function standResult(game) {
  App.updateDealer(game.dealer);
  App.updatePlayer(game.player);
  App.updateResult(game.result);
  App.enableDealIfGameFinished(game.result);
};

// App.socket = {}

App.registerClientActions = function registerClientActions() {
  $('#deal').click(() => {
    App.deal();
  });

  $('#hit').click(() => {
    App.hit();
  });

  $('#stand').click(() => {
    App.stand();
  });
};

// listen on event
App.registerServerActions = function registerServerActions() {
  const self = this;
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
};

App.init = function init() {
//   const clientSocket = require('./socket.client');
  // var socket = io.connect('http://localhost:8080');
  // App.socket = socket;
  const self = this;
  // App.socket = clientSocket.events.socket;
  self.clientSocket = clientSocket.events();
  App.registerClientActions();
  App.registerServerActions();
  App.enableDeal();
};

$(document).ready(() => {
  App.init();
});
