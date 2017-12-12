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

    OutType: {
        Error: 0,
        Single: 1,
        Pair: 2,
        Three: 3,
        ThreeWithOne: 4,
        ThreeWithPair: 5,
        Straight: 6,
        Plane: 7,
        PlaneWithPairs: 8,
        FourWithTwo: 9,
        FourWithPairs: 10,
        Straight: 11,
        StraightPairs: 12,
        StraightThree: 13,
        Bomb: 100,
        Rocket: 101,
    },

    CountMapType: [
        [OutType.Error],
        [OutType.Single],
        [OutType.Pair, OutType.Rocket],
        [OutType.Three],
        [OutType.ThreeWithOne, OutType.Bomb],
        [OutType.ThreeWithPair, OutType.Straight],
        [OutType.FourWithTwo, OutType.StraightPairs, OutType.Straight],
        [OutType.Straight],
        [OutType.Plane, OutType.StraightPairs, OutType.Straight],
        [OutType.StraightThree, OutType.Straight],
        [OutType.PlaneWithPairs, OutType.StraightPairs, OutType.Straight],
        [OutType.Straight],
        [OutType.StraightThree, OutType.StraightPairs, OutType.Straight],
        [OutType.Straight],
    ],

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

    sortPokers: function (arrPokers) {
        return arrPokers.sort((a, b) => {
            return a.point > b.point;
        });
    },

    getOutputType: function (arrPokers) {
        var sortPokers = this.sortPokers(arrPokers);
        var suspectedType = this.OutType[sortPokers.length];
        for (var i = 0; i < suspectedType.length; i++) {
            var sType = suspectedType[i];
            switch (sType) {
                case OutType.Error:
                    return OutType.Error;
                    break;
                case OutType.Single:
                    return OutType.Single;
                    break;
                case OutType.Pair:
                    if (sortPokers[0].point === sortPokers[1].point) {
                        return OutType.Pair;
                    } else {
                        return OutType.Error;
                    }
                    break;
            }
        }
    },
};