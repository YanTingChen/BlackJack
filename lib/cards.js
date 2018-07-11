class PlayingCards {
  constructor() {
    const self = this;
    self.cards = self.getShuffledPack();
    self.currentPackLocation = 0;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  // 洗牌
  getShuffledPack() {
    const self = this;
    const cards = [];
    cards[0] = 0;
    for (let i = 1; i < 52; i += 1) {
      const j = self.getRandomInt(i);
      cards[i] = cards[j];
      cards[j] = i;
    }
    return cards;
  }

  // 抽取下一張牌
  dealNextCard() {
    const self = this;
    // console.log("currentPackLocation: " + self.currentPackLocation);
    if (self.currentPackLocation >= self.cards.length) {
      // 52張牌用完
      self.cards = self.getShuffledPack();
      self.currentPackLocation = 0;
      console.log('Created new pack');
    }
    const cardNumber = self.cards[self.currentPackLocation];
    self.currentPackLocation += 1;
    return cardNumber;
  }
}

function createPlayingCards() {
  return new PlayingCards();
}

exports.createPlayingCards = createPlayingCards;
