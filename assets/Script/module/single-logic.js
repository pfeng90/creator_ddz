const State = require('state.com');
const Pokers = require('pokers');
const Utils = require('utils');

const PLAYER_MAX_COUNT = 3;

class SingleLogic {
    constructor(delegate) {
        this.delegate = delegate;
        this.model = null;
        this.instance = null;
        this.arrPlayers = [];
        this.arrPokers = [];
        // 决定地主的牌
        this.nLorderIndex = 0;
        // 轮数
        this.nRound = 0;
        this._initState();
    }

    _initState() {
        this.model = new State.StateMachine("root");
        let initial = new State.PseudoState("init-root", this.model, State.PseudoStateKind.Initial);

        // 当前这一把的状态

        let idle = new State.State('等待', this.model);
        let deal = new State.State('发牌', this.model);
        let elect = new State.State('叫地主', this.model);
        let grab = new State.State('抢地主', this.model);
        let raise = new State.State('加倍', this.model);
        let play = new State.State('操作', this.model);

        initial.to(idle);

        idle.entry( () => {
            this.arrPlayers = [];
        });

        deal.entry ( () => {
            this.arrPokers = Pokers.randomPokers();
            let nLorderIndex = Utils.getRandomInt(0, this.arrPokers.length - Pokers.KeyCount);
            this.nLorderIndex = Math.floor(nLorderIndex / PLAYER_MAX_COUNT);
            let nEachCount = (Pokers.Count - Pokers.KeyCount) / PLAYER_MAX_COUNT;
            let nLorderPos = nLorderIndex % nEachCount * PLAYER_MAX_COUNT + this.nLorderIndex;
            this.delegate.onGetDealPokers({
                handPokers : this.arrPokers.slice(0, nEachCount),
                lorderPoker : {
                    poker: this.arrPokers[nLorderIndex],
                    index: nLorderPos,
                }
            });
            setTimeout(() => {
                this._evaluate(SingleLogic.StateEvent.Next);
            }, 2000);
        });

        elect.entry( () => {
            this.delegate.onElectLorder(this.nLorderIndex);
        });

        // create a State machine instance
        this.instance = new State.StateMachineInstance("fsm");
        State.initialise(this.model, this.instance);
    }

    _evaluate(msg) {
        if (this.evaluating) {
            // can not call fsm's evaluate recursively
            setTimeout(() => {
                State.evaluate(this.model, this.instance, msg);
            }, 1);
            return; 
        }
        this.evaluating = true;
        State.evaluate(this.model, this.instance, msg);
        this.evaluating = false;
    }

    addPlayer(player) {
        this.arrPlayers.push(player);
        if (this.arrPlayers.length === PLAYER_MAX_COUNT) {
            this._evaluate(SingleLogic.StateEvent.Next);
        }
    }

    electLorder(nPlayerIndex) {

    }

    giveupLorder(nPlayerIndex) {

    }
}

SingleLogic.StateType = {
    Idle: 0,
    Deal: 1,
    Elect: 2,
    ElectCall: 3,
    ElectNext: 4,
    ElectPrev: 5,
    ElectGrab: 6,
    Raise: 7,
    Play: 8,
    PlaySelf: 9,
    PlayNext: 10,
    PlayPrev: 11,
};

SingleLogic.StateEvent = {
    Idle : 'idle',
    Deal: 'deal',
    Elect: 'elect',
    ElectCall: 'elect_call',
    ElectNext: 'elect_next',
    ElectPrev: 'elect_prev',
    ElectPass: 'elect_pass',
    Raise: 'raise', 
    Play: 'play',
    PlaySelf: 'play_self',
    PlayNext: 'play_next',
    PlayPrev: 'play_prev',
    PlayPass: 'play_pass',
    Next : 'next',
    Turn : 'turn',
};

module.exports = SingleLogic;