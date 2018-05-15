var cards = require('./cards');

// Blackjack game.
function BlackjackGame() {
    var self = this;
    self.dealerHand = new BlackjackHand();
    self.playerHand = new BlackjackHand();
    self.result = 'None';
    self.cards = cards.createPlayingCards();
}

//開新局
BlackjackGame.prototype.newGame = function () {
    var self = this;
    self.dealerHand = new BlackjackHand();
    self.playerHand = new BlackjackHand();

    self.playerHand.addCard(self.cards.dealNextCard());
    self.dealerHand.addCard(self.cards.dealNextCard());
    self.playerHand.addCard(self.cards.dealNextCard());
    self.result = 'None';
}

BlackjackGame.prototype.isInProgress = function () {
    var self = this;
    return (self.result === 'None') && (self.dealerHand.hasCards());
}

BlackjackGame.prototype.toJson = function () {
    var self = this;
    return {
        dealer: {
            cards: self.dealerHand.getCards(),
            score: self.dealerHand.getScore()
        },
        player: {
            cards: self.playerHand.getCards(),
            score: self.playerHand.getScore(),
        },
        result: self.result
    };
}

//判斷是否Bust
BlackjackGame.prototype.getResultForPlayer = function () {
    var self = this;
    var score = self.playerHand.getScore();
    if (score > 21) {
        return 'Bust';
    }
    return 'None';
}

//是否在遊戲中
BlackjackGame.prototype.isGameInProgress = function () {
    var self = this;
    return self.result === 'None';
}

//要牌
BlackjackGame.prototype.hit = function () {
    var self = this;
    if (self.isGameInProgress()) {
        self.playerHand.addCard(self.cards.dealNextCard());
        self.result = self.getResultForPlayer();
    }
}

//判斷輸贏
BlackjackGame.prototype.getResult = function () {
    var self = this;
    var playerScore = self.playerHand.getScore();
    var dealerScore = self.dealerHand.getScore();

    if (21 >= playerScore && playerScore > dealerScore || dealerScore > 21) {
        return 'You won!';
    }
    if (playerScore === dealerScore) {
        return 'Tie!';
    }
    if (playerScore > 21 || dealerScore > playerScore && 21 >= dealerScore) {
        return 'You lost!';
    }

}

//停牌
BlackjackGame.prototype.stand = function () {
    var self = this;
    if (self.isGameInProgress()) {
        while (self.dealerHand.getScore() < 17) {
            self.dealerHand.addCard(self.cards.dealNextCard());
        }
        self.result = self.getResult();
    }
}


// Blackjack hand.
function BlackjackHand() {
    var self = this;
    self.cards = [];
}

BlackjackHand.prototype.hasCards = function () {
    var self = this;
    return self.cards.length > 0;
}

BlackjackHand.prototype.addCard = function (card) {
    var self = this;
    self.cards.push(card);
}

BlackjackHand.prototype.numberToSuit = function (number) {
    var suits = ['C', 'D', 'H', 'S'];
    var index = Math.floor(number / 13);
    return suits[index];
}

BlackjackHand.prototype.numberToCard = function (number) {
    var self = this;
    return {
        rank: (number % 13) + 1,
        suit: self.numberToSuit(number)
    };
}

BlackjackHand.prototype.getCards = function () {
    var self = this;
    var convertedCards = [];
    for (var i = 0; i < self.cards.length; i++) {
        var number = self.cards[i];
        convertedCards[i] = self.numberToCard(number);
    }
    return convertedCards;
}

BlackjackHand.prototype.getCardScore = function (card) {
    if (card.rank === 1) {
        return 11;
    } else if (card.rank >= 11) {
        return 10;
    }
    return card.rank;
}

BlackjackHand.prototype.getScore = function () {
    var self = this;
    var score = 0;
    var cards = self.getCards();
    var aces = [];

    // 卡牌點數總和 (除了Aces)
    for (var i = 0; i < cards.length; ++i) {
        var card = cards[i];
        if (card.rank === 1) {
            aces.push(card);
        } else {
            score = score + self.getCardScore(card);
        }
    }

    // 判斷 Aces
    if (aces.length > 0) {
        var acesScore = aces.length * 11;
        var acesLeft = aces.length;
        while ((acesLeft > 0) && (acesScore + score) > 21) {
            acesLeft = acesLeft - 1;
            acesScore = acesScore - 10;
        }
        score = score + acesScore;
    }

    return score;
}

BlackjackHand.prototype.isBust = function () {
    var self = this;
    return self.getScore() > 21;
}

// 輸出
function newGame() {
    return new BlackjackGame();
}

exports.newGame = newGame