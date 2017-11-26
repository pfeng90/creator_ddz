import { setTimeout } from 'timers';

var fsm = require('game-fsm');
var utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {
        ndPlayerPos: [cc.Node],
        ndPanelPrepare: cc.Node,
        ndPanelSearch: cc.Node,
        ndPanelResult: cc.Node,
        ndPanelPlaying: cc.Node,
        playerPrefab: cc.Prefab,
        cardstackPrefab: cc.Prefab,
        
    },

    // use this for initialization
    onLoad: function () {
        this.ndPlayerPos.forEach((ndPlayer, i) => {
            var player = cc.instantiate(this.playerPrefab);
            ndPlayer.addChild(player);
            var playerCom = player.getComponent('Player');
            playerCom.init({bIsSelf: i === 0, name: 'kkkkk', coin: 30000});
        })

        fsm.init(this);
    },

    onBtnPrepareClicked: function () {
        fsm.changeState(fsm.StateEvent.Search);
    },

    onBtnContinueClicked: function () {
        fsm.changeState(fsm.StateEvent.Continue);
    },

    onBtnExitClicked: function () {
        fsm.changeState(fsm.StateEvent.Prepare);
    },

    onStateChanged: function (st) {
        switch(st) {
            case fsm.StateType.Prepare:
                this.ndPanelSearch.active = false;
                this.ndPanelResult.active = false;
                this.ndPanelPrepare.active = true;
                break;
            case fsm.StateType.Search:
                this.ndPanelSearch.active = true;
                this.ndPanelResult.active = false;
                this.ndPanelPrepare.active = false;
                setTimeout(() => {
                    fsm.changeState(fsm.StateEvent.Playing);
                }, 3000);
                break;
            case fsm.StateType.Playing:
                this.ndPanelSearch.active = false;
                this.ndPanelResult.active = false;
                this.ndPanelPrepare.active = false;

                // setTimeout(() => {
                //     fsm.changeState(fsm.StateEvent.Settled);
                // }, utils.getRandomInt(3000, 12000));
                break;
            case fsm.StateType.Settled:
                this.ndPanelSearch.active = false;
                this.ndPanelResult.active = true;
                this.ndPanelPrepare.active = false;
                break;
            default:
                break;
        }

        this.ndPanelPlaying.active = st === fsm.StateType.Playing;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
