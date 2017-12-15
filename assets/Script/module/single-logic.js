const State = require('state.com');
const Pokers = require('pokers');
const Utils = require('utils');

const PLAYER_MAX_COUNT = 3;

function on (message) {
    return function (msgToEvaluate) {
        return msgToEvaluate === message;
    };
}

class SingleLogic {
    constructor(delegate) {
        this.delegate = delegate;
        this.model = null;
        this.instance = null;
        this.arrPlayers = [];
        this.arrPokerSets = [];
        // 决定地主的牌
        this.nLorderIndex = 0;
        // 叫地主的玩家列表
        this.arrPreLorder = [];
        // 轮数
        this.nRound = 0;
        // 出牌序列
        this.nTurnIndex = 0;
        // 加倍个数
        this.nRaiseCount = 0;
        // 上把牌型
        this.oCurrentPokerType = {
            nType: null,
            nIndex: null,
        };
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
        let play = new State.State('出牌', this.model);
        let end = new State.State('结算', this.model);

        initial.to(idle);

        idle.to(deal).when(on(SingleLogic.StateEvent.Next));
        deal.to(elect).when(on(SingleLogic.StateEvent.Next));
        elect.to(elect).when(on(SingleLogic.StateEvent.Turn));
        elect.to(grab).when(on(SingleLogic.StateEvent.Next));
        elect.to(raise).when(on(SingleLogic.StateEvent.Raise));
        elect.to(deal).when(on(SingleLogic.StateEvent.ReDeal));
        grab.to(grab).when(on(SingleLogic.StateEvent.Turn));
        grab.to(raise).when(on(SingleLogic.StateEvent.Next));
        raise.to(play).when(on(SingleLogic.StateEvent.Next));
        play.to(play).when(on(SingleLogic.StateEvent.Turn));
        play.to(end).when(on(SingleLogic.StateEvent.Next));

        idle.entry( () => {
            this.arrPlayers = [];
        });

        deal.entry ( () => {
            let arrPokers = Pokers.randomPokers();
            let nLorderIndex = Utils.getRandomInt(0, arrPokers.length - Pokers.KeyCount);
            let nEachCount = (Pokers.Count - Pokers.KeyCount) / PLAYER_MAX_COUNT;
            this.nLorderIndex = Math.floor(nLorderIndex / nEachCount);
            let nLorderPos = (nLorderIndex % nEachCount) * PLAYER_MAX_COUNT + this.nLorderIndex;
            this.arrPokerSets = [];
            for (let i = 0; i < PLAYER_MAX_COUNT ; i++) {
                this.arrPokerSets.push(arrPokers.slice(i * nEachCount, (i + 1) * nEachCount));
            }
            this.delegate.onGetDealPokers({
                handPokers : this.arrPokerSets,
                lorderPoker : {
                    poker: arrPokers[nLorderIndex],
                    index: nLorderPos,
                }
            });
            this.nRound = 0;
            this.arrPreLorder = [];
            this.oCurrentPokerType = {
                nType: null,
                nIndex: null,
            };
            setTimeout(() => {
                this._evaluate(SingleLogic.StateEvent.Next);
            }, 2000);
        });

        elect.entry( () => {
            this.delegate.onElectLorder(this.nLorderIndex);
        });

        grab.entry( () => {
            this.delegate.onGrabLorder(this.nLorderIndex);
        });

        raise.entry( () => {
            this.nTurnIndex = this.arrPreLorder.pop();
            this.nRaiseCount = 0;
            this.delegate.onRaiseState();
        });

        play.entry( () => {
            this.delegate.onPlayerHandle(this.nTurnIndex);
        });

        end.entry( () => {
            this.delegate.onGameEnd();
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

    electLorder(nPlayerIndex, bElect) {
        this.nRound++;
        this.nLorderIndex = (this.nLorderIndex + 1) % PLAYER_MAX_COUNT;
        if (bElect === true) {
            this.arrPreLorder.push(nPlayerIndex);
            if (this.nRound === PLAYER_MAX_COUNT) {
                this._evaluate(SingleLogic.StateEvent.Raise);
            } else {
                this._evaluate(SingleLogic.StateEvent.Next);
            }
        } else {
            if (this.nRound === PLAYER_MAX_COUNT) {
                // 全部弃权，重新发牌
                this._evaluate(SingleLogic.StateEvent.ReDeal);
            } else {
                this._evaluate(SingleLogic.StateEvent.Turn);
            }
        }
    }

    grabLorder(nPlayerIndex, bGrab) {
        this.nRound++;
        this.nLorderIndex = (this.nLorderIndex + 1) % PLAYER_MAX_COUNT;
        if (bGrab === true) {
            this.arrPreLorder.push(nPlayerIndex);
            if (this.nRound > PLAYER_MAX_COUNT) {
                this._evaluate(SingleLogic.StateEvent.Next); 
            } else if (this.nRound === PLAYER_MAX_COUNT) {
                this.nLorderIndex = this.arrPreLorder[0];
                this._evaluate(SingleLogic.StateEvent.Turn);
            } else {
                this._evaluate(SingleLogic.StateEvent.Turn);
            }
        } else {
            if (this.nRound > PLAYER_MAX_COUNT) {
                this._evaluate(SingleLogic.StateEvent.Next); 
            } else if (this.nRound === PLAYER_MAX_COUNT) {
                // 全部抢地主,最后一人获的地主
                if (this.arrPreLorder.length > 1) {
                    this._evaluate(SingleLogic.StateEvent.Turn);
                }
                else {
                    this._evaluate(SingleLogic.StateEvent.Next); 
                }
            } else {
                this._evaluate(SingleLogic.StateEvent.Turn);
            }
        }
    }

    raiseBet(nPlayerIndex, nMultiple) {
        this.nRaiseCount++;
        // if (this.nRaiseCount == PLAYER_MAX_COUNT) {
            this._evaluate(SingleLogic.StateEvent.Next);
        // }
    }

    playPokers(nPlayerIndex, arrPokers) {
        if (arrPokers.length === 0) {
            this.nTurnIndex = (this.nTurnIndex + 1) % PLAYER_MAX_COUNT;
            this._evaluate(SingleLogic.StateEvent.Turn);
        } else {
            let outType = Pokers.getOutputType(arrPokers);
            // 跟上轮牌型做比较
            if (this.oCurrentPokerType.nIndex === nPlayerIndex || 
                Pokers.compareOutType(this.oCurrentPokerType.nType, outType)) {
                this.oCurrentPokerType.nType = outType;
                this.oCurrentPokerType.nIndex = nPlayerIndex;

                let arrPokerSet = this.arrPokerSets[nPlayerIndex];
                if (arrPokerSet) {
                    arrPokerSet = arrPokerSet.filter(poker => !arrPokers.includes(poker));
                    this.arrPokerSets[nPlayerIndex] = arrPokerSet;
                    if (arrPokerSet.length === 0) {
                        this._evaluate(SingleLogic.StateEvent.Next);
                    } else {
                        this.nTurnIndex = (this.nTurnIndex + 1) % PLAYER_MAX_COUNT;
                        this._evaluate(SingleLogic.StateEvent.Turn);
                    }

                    this.delegate.onServerBroadcast(SingleLogic.BroadcastType.OutputPokers, {
                        nPlayerIndex: nPlayerIndex,
                        arrPokers: arrPokers,
                    });
                }
            // 牌型比较失败
            } else {
                this.delegate.onServerError(SingleLogic.ErrorCode.WrongPokerType, {
                    nIndex: nPlayerIndex,
                });
            }
        }
   }
}

SingleLogic.StateType = {
    Idle: 0,
    Deal: 1,
    Elect: 2,
    Raise: 3,
    Play: 4,
    End: 5,
};

SingleLogic.StateEvent = {
    Idle : 'idle',
    Deal: 'deal',
    Elect: 'elect',
    Grab: 'grab',
    Raise: 'raise', 
    Play: 'play',
    Next : 'next',
    Turn : 'turn',
    // 重新发牌
    ReDeal: 'redeal',
};

SingleLogic.BroadcastType = {
    OutputPokers: 0, // 玩家出牌
};

SingleLogic.ErrorCode = {
    WrongPokerType: 0, // 牌型比较错误
};

module.exports = SingleLogic;