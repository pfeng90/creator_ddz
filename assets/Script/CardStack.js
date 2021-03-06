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
        _nShowCount: 0,
        _arrSelectedCardData: [],
    },

    _display: function (bHide) {
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
        

        let cardSize = new cc.Size(0, 0);
        let cardins = cc.instantiate(this.cardPrefab);
        cardSize.width = cardins.width;
        cardSize.height = cardins.height;
        cardins.destroy();

        let nColCount = 0;
        
        if (this.nMaxWidth > 0) {
            let gap = this.nMaxWidth - cardSize.width;
            gap = gap > 0 ? gap : 0;
            nColCount = Math.floor( gap / this.nGapX ) + 1;
        }
        else {
            ant = anchorType.CENTER; 
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
        let nMaxRow = Math.floor(nCardCount / nColCount);
        let nHalfWidth = cardSize.width / 2;
        this._arrCards.forEach( (cardData, index) => {
            let card = cc.instantiate(this.cardPrefab);
            switch (ant)
            {
                case anchorType.LEFT:
                    card.x = index % nColCount * this.nGapX + nHalfWidth;
                    card.y = - Math.floor(index / nColCount) * this.nGapY;
                    break;
                case anchorType.RIGHT:
                    let row = Math.floor(index / nColCount)
                    let col = index % nColCount;
                    if (row === nMaxRow) {
                        col = nColCount - ( nCardCount - index );
                    }
                    card.x = - nHalfWidth - (nColCount - 1 - col) * this.nGapX;
                    card.y = - row * this.nGapY;
                    break;
                default:
                    card.x = nTotalOffsetX;
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
            card.getValue = () => {
                return cardData;
            }

            this._arrCardNodes.push(card);

            if (bHide) {
                card.active = false;
            }
        })

        this.node.width = cardSize.width + (this._arrCards.length - 1) * this.nGapX;
        this.node.height = cardSize.height + this.nJumpHeight;
    },

    _distoryCardNodes: function () {
        this._arrCardNodes.forEach(cardnode => {
            cardnode.destroy();
        });
        this._arrCardNodes = [];
    },

    // use this for initialization
    onLoad: function () {
    },

    init: function (arrCards) {
        this._arrCards = arrCards;
        this._nShowCount = 0;
        this._display(true);
    },

    showOneByOne: function () {
        var card = this._arrCardNodes[this._nShowCount];
        if (card) {
            card.active = true;
        }
        this._nShowCount ++;
    },

    sort: function () {
        this._arrCards.sort((a, b) => {
            if (a.point > b.point) {
                return -1;
            } else if (a.point < b.point) {
                return 1;
            }
            else {
                return a.suit > b.suit ? -1 : 1;
            }
        });

        this._arrCardNodes.forEach(cardnode => {
            cardnode.destroy();
        });
        this._arrCardNodes = []; 
        this._display();
    },

    resetCards: function (arrCards) {
        this.clearCards();
        this._arrCards =  arrCards;
        if (this._arrCards.length > 0) {
            this._display();
        }
    },

    clearCards: function () {
        this._arrCards = [];
        this._distoryCardNodes();
    },

    removeCards: function (arrCards) {
        if (arrCards.length > 0 ) {
            this._distoryCardNodes();
            this._arrCards = this._arrCards.filter(card => !arrCards.includes(card));
            this._display();
        }
    },

    getAllCardNodes: function () {
        return this._arrCardNodes;
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
        let _clearSelectedCards = (bEffect) => {
            this._arrSelectedCardData = [];
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

    getSelectData: function () {
        let arrSelectData = [];
        this._arrCardNodes.forEach(cardnode => {
            if (cardnode.y > 0) {
                arrSelectData.push(cardnode.getValue());
            }
        })
        return arrSelectData;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
