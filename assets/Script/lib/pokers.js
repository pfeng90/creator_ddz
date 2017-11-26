function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
 
}

module.exports = {
    Suit: {
        Diamond: 0,
        Club: 1,
        Heart: 2,
        Spade: 3,
    },

    Point: {
        Min: 3,
        T: 10,
        J: 11,
        Q: 12,
        K: 13,
        Ace: 14,
        Two: 15,
        SmallJoker: 16,
        BigJoker: 17,
    },

    Count: 54,

    KeyCount: 3,

    randomPokers: function () {
        var arrIndex = [];
        for (var i = 0; i < 54; i++) {
            arrIndex.push(i);
        }
        shuffle(arrIndex);
        var pokers = [];
        arrIndex.forEach(index => {
            var p = {
                point : this.Point.Min,
                suit: this.Suit.Diamond,
            };
            var suit = Math.floor(index / 13);
            p.point = index % 13;
            if (suit > this.Suit.Spade) {
                p.point += this.Point.SmallJoker;
            } else {
                p.point += this.Point.Min;
                p.suit = suit;
            }
            pokers.push(p);
        })

        return pokers;

    },
};