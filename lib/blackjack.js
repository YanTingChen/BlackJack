const cards = require('./cards');

// Blackjack hand.
class BlackjackHand {
  constructor() {
    const self = this;
    self.cards = [];
  }

  hasCards() {
    const self = this;
    // return this.cards.length > 0;
    return self.cards.length > 0;
  }

  addCard(card) {
    const self = this;
    self.cards.push(card);
  }

  numberToSuit(number) {
    const self = this;
    const suits = ['C', 'D', 'H', 'S'];
    const index = Math.floor(number / 13);
    return suits[index];
  }

  numberToCard(number) {
    const self = this;
    return {
      rank: (number % 13) + 1,
      suit: self.numberToSuit(number),
    };
  }

  getCards() {
    const self = this;
    const convertedCards = [];
    for (let i = 0; i < self.cards.length; i += 1) {
      const number = self.cards[i];
      convertedCards[i] = self.numberToCard(number);
    }
    return convertedCards;
  }

  getCardScore(card) {
    const self = this;
    if (card.rank === 1) {
      return 11;
    }
    if (card.rank >= 11) {
      return 10;
    }
    return card.rank;
  }

  getScore() {
    const self = this;
    let score = 0;
    const cards = self.getCards();
    const aces = [];
    // 卡牌點數總和 (除了Aces)
    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      if (card.rank === 1) {
        aces.push(card);
      } else {
        score += self.getCardScore(card);
      }
    }
    // 判斷 Aces
    if (aces.length > 0) {
      let acesScore = aces.length * 11;
      let acesLeft = aces.length;
      while ((acesLeft > 0) && (acesScore + score) > 21) {
        acesLeft -= 1;
        acesScore -= 10;
      }
      score += acesScore;
    }
    return score;
  }

  isBust() {
    const self = this;
    return self.getScore() > 21;
  }
}
// Blackjack game.
class BlackjackGame {
  constructor() {
    const self = this;
    self.dealerHand = new BlackjackHand();
    self.playerHand = new BlackjackHand();
    self.result = 'None';
    self.cards = cards.createPlayingCards();
  }

  // 開新局
  newGame() {
    const self = this;
    self.dealerHand = new BlackjackHand();
    self.playerHand = new BlackjackHand();
    self.playerHand.addCard(self.cards.dealNextCard());
    self.dealerHand.addCard(self.cards.dealNextCard());
    self.playerHand.addCard(self.cards.dealNextCard());
    self.result = 'None';
  }

  isInProgress() {
    const self = this;
    return (self.result === 'None') && (self.dealerHand.hasCards());
  }

  toJson() {
    const self = this;
    return {
      dealer: {
        cards: self.dealerHand.getCards(),
        score: self.dealerHand.getScore(),
      },
      player: {
        cards: self.playerHand.getCards(),
        score: self.playerHand.getScore(),
      },
      result: self.result,
    };
  }

  // 判斷是否Bust
  getResultForPlayer() {
    const self = this;
    const score = self.playerHand.getScore();
    if (score > 21) {
      return 'Bust';
    }
    return 'None';
  }

  // 是否在遊戲中
  isGameInProgress() {
    const self = this;
    return self.result === 'None';
  }

  // 要牌
  hit() {
    const self = this;
    if (self.isGameInProgress()) {
      self.playerHand.addCard(self.cards.dealNextCard());
      self.result = self.getResultForPlayer();
    }
  }

  // 判斷輸贏
  getResult() {
    const self = this;
    const playerScore = self.playerHand.getScore();
    const dealerScore = self.dealerHand.getScore();
    if (playerScore <= 21 && playerScore > dealerScore || dealerScore > 21) {
      return 'You won!';
    }
    if (playerScore === dealerScore) {
      return 'Tie!';
    }
    if (playerScore > 21 || dealerScore > playerScore && dealerScore <= 21) {
      return 'You lost!';
    }
    return '';
  }

  // 停牌
  stand() {
    const self = this;
    if (self.isGameInProgress()) {
      while (self.dealerHand.getScore() < 17) {
        self.dealerHand.addCard(self.cards.dealNextCard());
      }
      self.result = self.getResult();
    }
  }
}


// 輸出
function newGame() {
  return new BlackjackGame();
}

exports.newGame = newGame;
