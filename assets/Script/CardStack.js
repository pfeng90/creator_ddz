cc.Class({
    extends: cc.Component,

    properties: {
        nGapX: {
            default: 40,
            type: cc.Integer
        },
        nGapY: {
            default: 100,
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
            {point: 5, suit: 3},
            {point: 5, suit: 3},
            {point: 15, suit: 2},
            {point: 17, suit: 1},
            {point: 16, suit: 3},
            {point: 5, suit: 3},
            {point: 15, suit: 2},
            {point: 5, suit: 3},
            {point: 15, suit: 2},
        ];

        let anchorType = {
            LEFT : 0,
            CENTER : 1, 
            RIGHT: 2,
        }

        let ant = anchorType.CENTER;

        if (this.node.anchorX < 0.5) {
            ant = anchorType.LEFT;
        }
        else if (this.node.anchorX > 0.5) {
            ant = anchorType.RIGHT;
        }

        let nTotalOffsetX = 0;
        let nTotalOffsetY = 0;
        

        let cardSize = new cc.Size(0, 0);
        let cardins = cc.instantiate(this.cardPrefab);
        cardSize.width = cardins.width;
        cardSize.height = cardins.height;
        cardins.destroy();

        let nRowCount = 0;
        
        if (this.nMaxWidth > 0) {
            let gap = this.nMaxWidth - cardSize.width;
            gap = gap > 0 ? gap : 0;
            nRowCount = Math.floor( gap / this.nGapX ) + 1;
        }

        switch (ant)
        {
            case anchorType.LEFT:
                break;
            case anchorType.RIGHT:
                break;
            default:
                let nOffsetX = this._arrCards.length % 2 === 0 ? - this.nGapX / 2 : 0;
                let nLeftOffset = - Math.floor((this._arrCards.length - 1) / 2) * this.nGapX;
                nTotalOffsetX = nLeftOffset + nOffsetX;
                break;
        }
        
        let nCardCount = this._arrCards.length;
        let nMaxRow = Math.floor(nCardCount / nRowCount);
        this._arrCards.forEach( (cardData, index) => {
            let card = cc.instantiate(this.cardPrefab);
                       
            switch (ant)
            {
                case anchorType.LEFT:
                    card.x = index % nRowCount * this.nGapX;
                    card.y = - Math.floor(index / nRowCount) * this.nGapY;
                    break;
                case anchorType.RIGHT:
                    let row = Math.floor(index / nRowCount)
                    let col = index % nRowCount;
                    if (row === nMaxRow) {
                        col = nRowCount - ( nCardCount - index );
                    }
                    card.x = col * this.nGapX;
                    card.y = - row * this.nGapY;
                    break;
                default:
                    card.x = nTotalOffsetX;
                    card.y = nTotalOffsetY;
                    nTotalOffsetX += this.nGapX; 
                    break;
            }
            
            this.node.addChild(card);
            let cardCom = card.getComponent('Card');
            cardCom.init(cardData);

            card.componet = cardCom;
            card.selectOrNot = () => {
                card.y = card.y != 0 ? 0 : this.nJumpHeight;
            };

            this._arrCardNodes.push(card);
        })

        this.node.width = cardSize.width + (this._arrCards.length - 1) * this.nGapX;
        this.node.height = cardSize.height + this.nJumpHeight;
        
    },

    init: function (arrCards, bTouchable) {
        this._arrCards = arrCards;
        if (bTouchable) {
            this.setTouchEventEnable();
        }
    },

    sort: function () {

    },

    setTouchEventEnable: function () {
        let _getCurrentCard = ptTouch => {
            for (let i = this._arrCardNodes.length - 1 ; i > -1; i--)
            {
                let card = this._arrCardNodes[i];
                let rect = card.getBoundingBox();
                if (cc.rectContainsPoint(rect, ptTouch))
                {
                    return card;
                }
            }
            return null;
        }

        let arrSelectedCard = [];
        let _clearSelectedCards = bEffect => {
            arrSelectedCard.forEach(card => {
                if (bEffect === true) {
                    card.selectOrNot();
                }
                card.componet.setSelected(false);
            })
            arrSelectedCard = [];
        }

        this.node.on('touchstart', event => {
            let ptTouch = this.node.convertTouchToNodeSpaceAR(event.touch);
            let card = _getCurrentCard(ptTouch);
            if (card) {
                arrSelectedCard.push(card);
            }
        })

        this.node.on('touchmove', event => {
            let lastCard = arrSelectedCard[arrSelectedCard.length - 1];
            if (lastCard && !lastCard.componet.getSelected()) {
                lastCard.componet.setSelected(true);
            }
            let ptTouch = this.node.convertTouchToNodeSpaceAR(event.touch);
            let card = _getCurrentCard(ptTouch);
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
