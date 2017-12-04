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
            this._logic.addPlayer(SingleData.Players[Utils.getRandomInt(0, SingleData.Players.length)]);
        });
    },

    onGetDealPokers: function (pokerData) {
        console.log(pokerData);
    },


    onElectLorder: function (nPlayerIndex) {

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
