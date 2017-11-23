cc.Class({
    extends: cc.Component,

    properties: {
        nGap: {
            default: 40,
            type: cc.Integer
        },
        nMaxWidth: {
            default: 0,
            type: cc.Integer
        },
        nJumpHeight: {
            default: 30,
            type: cc.Integer
        },

        cardPrefab: cc.Prefab,
        _arrCards: [],
        _arrCardNodes: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        this._arrCards = [
            {point: 5, suit: 3},
            {point: 5, suit: 3},
            {point: 15, suit: 2},
            {point: 17, suit: 1},
            {point: 16, suit: 3},
        ];
        var nOffsetX = this._arrCards.length % 2 === 0 ? - this.nGap / 2 : 0;
        var nLeftOffset = - Math.floor((this._arrCards.length - 1) / 2) * this.nGap
        var nTotalOffset = nLeftOffset + nOffsetX;
        var cardSize = new cc.Size(0, 0);
        this._arrCards.forEach( (cardData, index) => {
            var card = cc.instantiate(this.cardPrefab);
            card.x = nTotalOffset + index * this.nGap;
            this.node.addChild(card);
            var cardCom = card.getComponent('Card');
            cardCom.init(cardData);
            cardSize.width = card.width;
            cardSize.height = card.height;

            card.componet = cardCom;
            card.selectOrNot = () => {
                card.y = card.y != 0 ? 0 : this.nJumpHeight;
            };

            this._arrCardNodes.push(card);
        })

        this.node.width = cardSize.width + (this._arrCards.length - 1) * this.nGap;
        this.node.height = cardSize.height + this.nJumpHeight;
        
        this.setTouchEventEnable();
    },

    init: function (arrCards) {
        this._arrCards = arrCards;
    },

    sort: function () {

    },

    setTouchEventEnable: function () {
        var _getCurrentCard = ptTouch => {
            for (var i = this._arrCardNodes.length - 1 ; i > -1; i--)
            {
                var card = this._arrCardNodes[i];
                var rect = card.getBoundingBox();
                if (cc.rectContainsPoint(rect, ptTouch))
                {
                    return card;
                }
            }
            return null;
        }

        var arrSelectedCard = [];
        var _clearSelectedCards = bEffect => {
            arrSelectedCard.forEach(card => {
                if (bEffect === true) {
                    card.selectOrNot();
                }
                card.componet.setSelected(false);
            })
            arrSelectedCard = [];
        }

        this.node.on('touchstart', event => {
            var ptTouch = this.node.convertTouchToNodeSpaceAR(event.touch);
            var card = _getCurrentCard(ptTouch);
            if (card) {
                arrSelectedCard.push(card);
            }
        })

        this.node.on('touchmove', event => {
            var lastCard = arrSelectedCard[arrSelectedCard.length - 1];
            if (lastCard && !lastCard.componet.getSelected()) {
                lastCard.componet.setSelected(true);
            }
            var ptTouch = this.node.convertTouchToNodeSpaceAR(event.touch);
            var card = _getCurrentCard(ptTouch);
            if (card && card !== lastCard) {
                if (card === arrSelectedCard[arrSelectedCard.length - 2]) {
                    lastCard.componet.setSelected(false);
                    arrSelectedCard.pop();
                }
                else {
                    card.componet.setSelected(true);
                    arrSelectedCard.push(card);
                }
            }
        })

        this.node.on('touchend', event => {
            _clearSelectedCards(true);
        })

        this.node.on('touchcancel', event => {
            _clearSelectedCards();
        })
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
