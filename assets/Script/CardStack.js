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

        cardPrefab: cc.Prefab,
        _arrCards: [],
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
        this._arrCards.forEach( (cardData, index) => {
            var card = cc.instantiate(this.cardPrefab);
            card.x = nTotalOffset + index * this.nGap;
            this.node.addChild(card);
            var cardCom = card.getComponent('Card');
            cardCom.init(cardData);
        })
        
    },

    start: function () {
        console.log(this.node.getContentSize());
      },

    init: function (arrCards) {
        this._arrCards = arrCards;
    },

    sort: function() {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
