var pokers = require('pokers');
var utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {
        _arrAllPokers: [],
    },

    // use this for initialization
    onLoad: function () {

    },

    generatePokerData: function () {
        this._arrAllPokers = pokers.randomPokers();
    },

    getLordPoker: function () {
        if (this._arrAllPokers.length === pokers.Count) {
            var index = utils.getRandomInt(0, pokers.Count - pokers.KeyCount);
            return {
                poker: this._arrAllPokers[index],
                index: index,
            };
        }
    },

    getKeyPokers: function () {
        if (this._arrAllPokers.length === pokers.Count) {
            return this._arrAllPokers.slice(pokers.Count - pokers.KeyCount);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
