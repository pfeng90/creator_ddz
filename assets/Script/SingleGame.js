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
        _arrPokerSets : null,
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

        this.node.on(Event.C2S_CALL_LORDER, (event) => {
            this._logic.electLorder(event.detail.playerIndex, event.detail.bElected === true);
            var stateStr = event.detail.bElected ? '叫地主' : '不叫';
            this.node.emit(Event.STATE_SYNC, {
                index: event.detail.playerIndex,
                state: stateStr,
            });
        });

        this.node.on(Event.C2S_GRAB_LORDER, (event) => {
            this._logic.grabLorder(event.detail.playerIndex, event.detail.bGrabed === true);
            var stateStr = event.detail.bGrabed ? '抢地主' : '不抢';
            this.node.emit(Event.STATE_SYNC, {
                index: event.detail.playerIndex,
                state: stateStr,
            });
        });

        this.node.on(Event.C2S_RAISE_BET, (event) => {
            this._logic.raiseBet(event.detail.playerIndex, event.detail.nMultiple);
        });

        this.node.on(Event.C2S_PLAYER_HANDLE, (event) => {
            this._logic.playPokers(event.detail.playerIndex, event.detail.data);
        });
    },

    onGetDealPokers: function (pokerData) {
        this._arrPokerSets = null;
        this._arrPokerSets = pokerData.handPokers;
        let pd = {};
        pd.handPokers = pokerData.handPokers[0];
        pd.lorderPoker = pokerData.lorderPoker;
        this.node.emit(Event.DEAL_POKERS, pd);
    },


    onElectLorder: function (nPlayerIndex) {
        this.node.emit(Event.CALL_LORDER, nPlayerIndex);
        if (nPlayerIndex !== 0) {
            this.scheduleOnce(() => {
                var bElect = Math.random() < 0.5;
                this._logic.electLorder(nPlayerIndex, bElect);
                var stateStr = bElect ? '叫地主' : '不叫';
                this.node.emit(Event.STATE_SYNC, {
                    index: nPlayerIndex,
                    state: stateStr,
                });
            }, Utils.getRandomInt(2, 5));
        }
    },

    onGrabLorder: function (nPlayerIndex) {
        this.node.emit(Event.GRAB_LORDER, nPlayerIndex);
        if (nPlayerIndex !== 0) {
            this.scheduleOnce(() => {
                var bGrab = Math.random() < 0.5;
                this._logic.grabLorder(nPlayerIndex, bGrab);
                var stateStr = bGrab ? '抢地主' : '不抢';
                this.node.emit(Event.STATE_SYNC, {
                    index: nPlayerIndex,
                    state: stateStr,
                });
            }, Utils.getRandomInt(2, 5));
        }
    },

    onRaiseState: function () {
        this.node.emit(Event.S2C_RAISE_BET);
    },

    onPlayerHandle: function (nPlayerIndex) {
        this.node.emit(Event.S2C_PLAYER_HANDLE, nPlayerIndex);
        if (nPlayerIndex !== 0) {
            this.scheduleOnce(() => {
                var arrPokers = [];
                var pokerSet = this._arrPokerSets[nPlayerIndex];
                arrPokers.push(pokerSet.pop());
                this._logic.playPokers(nPlayerIndex, arrPokers);
            }, Utils.getRandomInt(2, 5)); 
        }
    },

    onGameEnd: function () {
        this.node.emit(Event.S2C_GAME_END); 
    },

    onServerError: function (errorCode, detail) {
        if (errorCode === SingleLogic.ErrorCode.WrongPokerType) {
            if (detail.nIndex !== 0) {
                this._logic.playPokers(detail.nIndex, []);
            } else {
                this.node.emit(Event.S2C_ERROR_CODE); 
            }
        }
    },

    onServerBroadcast: function (broadcastType, detail) {
        switch(broadcastType) {
            case SingleLogic.BroadcastType.OutputPokers:
                this.node.emit(Event.S2C_TABLE_SYNC, {
                    index: detail.nPlayerIndex,
                    data: detail.arrPokers,
                });
                break;
            default:
                break;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
