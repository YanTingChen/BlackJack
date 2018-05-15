function PlayingCards() {
    var self = this;
    self.cards = self.getShuffledPack();
    self.currentPackLocation = 0;
}

PlayingCards.prototype.getRandomInt = function (max) {
    return Math.floor(Math.random() * (max + 1));
}

//洗牌
PlayingCards.prototype.getShuffledPack = function () {
    var self = this;
    var cards = [];
    cards[0] = 0;
    for (var i = 1; i < 52; i++) {
        var j = self.getRandomInt(i);
        cards[i] = cards[j];
        cards[j] = i;
    }
    return cards;
}

//抽取下一張牌
PlayingCards.prototype.dealNextCard = function () {
    var self = this;
    // console.log("currentPackLocation: " + self.currentPackLocation);

    if (self.currentPackLocation >= self.cards.length) {
        //52張牌用完
        self.cards = self.getShuffledPack();
        self.currentPackLocation = 0;
        console.log("Created new pack");
    }

    var cardNumber = self.cards[self.currentPackLocation];
    self.currentPackLocation = self.currentPackLocation + 1;
    return cardNumber;
}

function createPlayingCards() {
    return new PlayingCards();
}

exports.createPlayingCards = createPlayingCards