var SingleLogic = require('single-logic');
var Event = require('event');
var SingleData = require('single-data');
var Utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _logic : null,
    },

    // use this for initialization
    onLoad: function () {
        this._logic = new SingleLogic(this);
        this._logic.addPlayer(SingleData.Players[Utils.getRandomInt(0, SingleData.Players.length)]);
        this._logic.addPlayer(SingleData.Players[Utils.getRandomInt(0, SingleData.Players.length)]);


        this.node.on(Event.PLAYER_PREPARED, (event) => {
            this.node.emit(Event.ENTER_SEARCH_LIST);
            setTimeout(() => {
                this._logic.addPlayer(SingleData.Players[Utils.getRandomInt(0, SingleData.Players.length)]);
            }, Utils.getRandomInt(1, 6) * 1000);
        });
    },

    onGetDealPokers: function (pokerData) {
        this.node.emit(Event.DEAL_POKERS, pokerData);
    },


    onElectLorder: function (nPlayerIndex) {
        this.node.emit(Event.CALL_LORDER, nPlayerIndex);
    },

    onGrabLorder: function (nPlayerIndex) {

    },

    onRaiseState: function () {

    },

    onPlayerHandle: function (nPlayerIndex) {

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
