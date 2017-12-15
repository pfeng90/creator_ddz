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
        if (arrPokers.length < 1) {
            return {nType: this.OutType.Error};
        }
        var sortedPokers = this.sortPokers(arrPokers);
        var setType = {
            Single : 0,
            Pair : 1,
            Triple: 2,
            Quadruple: 3,
        }
        var arrSets = [
            [], // 单牌
            [], // 对子
            [], // 三条
            [], // 四条
        ];
        var fSetContinue = function (s) {
            return (s[s.length - 1] - s[0] + 1) === s.length;
        }
        var count = 0;
        var lastPoint = null;
        var lastIndex = sortedPokers.length - 1;
        sortedPokers.forEach((poker, index) => {
            if (lastPoint) {
                if (lastPoint === poker.point) {
                    count++;
                } else {
                    arrSets[count].push(lastPoint);
                    count = 0;
                }
            }
            lastPoint = poker.point;
            if (index === lastIndex) {
                arrSets[count].push(poker.point);
            }
        });
        for(var i = arrSets.length - 1; i >= 0; i--) {
            var s = arrSets[i];
            if (s.length === sortedPokers.length /  (i + 1)) {
                switch(i) {
                    case setType.Single:
                        if (s.length === 1) {
                            return {nType: this.OutType.Single,
                                    keyPoker: s.pop()};
                        } else if (s.length === 2) {
                            // 跳过，让下面判断是否为火箭
                            ;
                        } else if (s.length > 4 &&
                                    s[s.length -1] < this.Point.Two && 
                                    fSetContinue(s)) {
                            return {nType: this.OutType.Straight,
                                    count: s.length,
                                    keyPoker: s.pop()};
                        } else {
                            return {nType: this.OutType.Error};
                        }
                        break;
                    case setType.Pair:
                        if (s.length === 1) {
                            return this.OutType.Pair;
                        } else if (s.length === 2) {
                            return {nType: this.OutType.Error};
                        } else if (fSetContinue(s)) {
                            return {nType: this.OutType.StraightPairs,
                                count: s.length,
                                keyPoker: s.pop()};
                        } else {
                            return {nType: this.OutType.Error};
                        }
                        break;
                    case setType.Triple:
                        if (s.length === 1) {
                            return this.OutType.Three;
                        } else if (s.length === 2) {
                            return {nType: this.OutType.Plane,
                                keyPoker: s.pop()};
                        } else if (fSetContinue(s)) {
                            return {nType: this.OutType.StraightThree,
                                count: s.length,
                                keyPoker: s.pop()};
                        } else {
                            return {nType: this.OutType.Error};
                        }
                        break;
                    case setType.Quadruple:
                        if (s.length === 1) {
                            return this.OutType.Bomb;
                        } else {
                            return {nType: this.OutType.Error};
                        }
                        break;
                }
            }
        }

        // 牌的数量决定可能的牌型
        var countMapType = [
            [],                     // 0 张牌
            [],                     // 1 张牌               
            [this.OutType.Rocket],  // 2 张牌
            [],                     // ... 以下类推
            [this.OutType.ThreeWithOne],
            [this.OutType.ThreeWithPair],
            [this.OutType.FourWithTwo],
            [],
            [this.OutType.Plane, this.OutType.FourWithPairs],
            [],
            [this.OutType.PlaneWithPairs],
            [],
            [this.OutType.Plane],
            [],
            [],
            [this.OutType.PlaneWithPairs],
            [this.OutType.Plane],
            [],
            [],
            [],
            [this.OutType.Plane, this.OutType.PlaneWithPairs],
        ];

        var suspectedType = countMapType[sortedPokers.length];
        for (var i = 0; i < suspectedType.length; i++) {
            var sType = suspectedType[i];
            switch (sType) {
                case this.OutType.Rocket:
                    if (sortedPokers[0].point > this.Point.Two) {
                        return {nType: this.OutType.Rocket};
                    }
                    break;
                case this.OutType.ThreeWithOne:
                    if (arrSets[setType.Triple].length === 1 &&
                        arrSets[setType.Single].length === 1) {
                        return {nType: this.OutType.ThreeWithOne,
                            keyPoker: arrSets[setType.Triple].pop()};
                    }
                    break;
                case this.OutType.ThreeWithPair:
                    if (arrSets[setType.Triple].length === 1 &&
                        arrSets[setType.Pair].length === 1) {
                        return {nType: this.OutType.ThreeWithPair,
                            keyPoker: arrSets[setType.Triple].pop()};
                    }
                    break;
                case this.OutType.FourWithTwo:
                    if (arrSets[setType.Quadruple].length === 1 &&
                        arrSets[setType.Single].length === 2) {
                        return {nType: this.OutType.FourWithTwo,
                            keyPoker: arrSets[setType.Quadruple].pop()};
                    }
                    break;
                case this.OutType.FourWithPairs:
                    if (arrSets[setType.Quadruple].length === 1 &&
                        arrSets[setType.Pair].length === 2) {
                        return {nType: this.OutType.FourWithPairs,
                            keyPoker: arrSets[setType.Quadruple].pop()};
                    }
                    break;
                case this.OutType.Plane:
                    if (arrSets[setType.Triple].length > 1 &&
                        fSetContinue(arrSets[setType.Triple]) &&
                        arrSets[setType.Single].length === arrSets[setType.Triple].length) {
                        return {nType: this.OutType.Plane,
                            count: arrSets[setType.Triple].length,
                            keyPoker: arrSets[setType.Triple].pop()};
                    }
                    break;
                case this.OutType.PlaneWithPairs:
                    if (arrSets[setType.Triple].length > 1 &&
                        fSetContinue(arrSets[setType.Triple]) &&
                        arrSets[setType.Pair].length === arrSets[setType.Triple].length) {
                        return {nType: this.OutType.PlaneWithPairs,
                            count: arrSets[setType.Triple].length,
                            keyPoker: arrSets[setType.Triple].pop()};
                    }
                    break;
                default:
                    break;
            }
        }

        return {nType: this.OutType.Error};
    },

    compareOutType: function (pokerTypeA, pokerTypeB) {
        if (pokerTypeA == null) {
            return true;
        }
        if (pokerTypeA.nType === pokerTypeB.nType)
        {
            if (pokerTypeA.nType === this.OutType.Straight || 
                pokerTypeA.nType === this.OutType.StraightPairs || 
                pokerTypeA.nType === this.OutType.StraightThree || 
                pokerTypeA.nType === this.OutType.Plane || 
                pokerTypeA.nType === this.OutType.PlaneWithPairs) {
                return pokerTypeB.count === pokerTypeA.count && 
                    pokerTypeB.keyPoker > pokerTypeA.keyPoker
            } else {
                return pokerTypeB.keyPoker > pokerTypeA.keyPoker
            }
        } else {
            if (pokerTypeA.nType === this.OutType.Rocket) {
                return false;
            } else if (pokerTypeB.nType === this.OutType.Rocket) {
                return true;
            } else if (pokerTypeB.nType === this.OutType.Bomb) {
                return true;
            } else {
                return false;
            }
        }
    },
};