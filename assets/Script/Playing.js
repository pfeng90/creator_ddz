var Event = require('event');

cc.Class({
    extends: cc.Component,

    properties: {
        ndCountdown : cc.Node,
        ndCountdownPts : [cc.Vec2],
        lbStates : [cc.Label],
        ndCardStacks : [cc.Node],
        ndElectionCall : cc.Node,
        ndElectionGrab : cc.Node,
        ndPlayerHandle : cc.Node,
        ndLastLeftCount : cc.Node,
        ndNextLeftCount : cc.Node,
        ndPlayerCardStack : cc.Node,
        ndDeal : cc.Node,
        ndRaise : cc.Node,
        ndSingleGame: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var clearState = () => {
            this.ndElectionCall.active = false;
            this.ndElectionGrab.active = false;
            this.ndRaise.active = false;
    
            this.lbStates.forEach((lb) => {
                lb.string = '';
            });
        };

        clearState();

        this.ndSingleGame.on(Event.DEAL_POKERS, (event) => {
            clearState();

            var comDeal = this.ndDeal.getComponent('Deal');
            comDeal.deal(event.detail.lorderPoker);

            var comCard = this.ndPlayerCardStack.getComponent('CardStack');
            comCard.init(event.detail.handPokers);
        });

        this.ndSingleGame.on(Event.CALL_LORDER, (event) => {
            var playerIndex = event.detail;
            this.ndCountdown.active = true;
            this.ndCountdown.setPosition(this.ndCountdownPts[playerIndex]);
            this.ndElectionCall.active = playerIndex == 0;
        });

        this.ndSingleGame.on(Event.GRAB_LORDER, (event) => {
            this.ndElectionCall.active = false;
            var playerIndex = event.detail;
            this.ndCountdown.active = true;
            this.ndCountdown.setPosition(this.ndCountdownPts[playerIndex]);
            this.ndElectionGrab.active = playerIndex == 0;
        });

        this.ndSingleGame.on(Event.STATE_SYNC, (event) => {
            var playerIndex = event.detail.index;
            this.lbStates[playerIndex].string = event.detail.state;
        });

        this.ndSingleGame.on(Event.S2C_RAISE_BET, (event) => {
            this.ndElectionGrab.active = false;
            this.ndRaise.active = true;
            this.ndCountdown.setPosition(this.ndCountdownPts[0]);
            var com = this.ndPlayerCardStack.getComponent('CardStack');
            com.setTouchEventEnable();
        });

        this.ndSingleGame.on(Event.S2C_PLAYER_HANDLE, (event) => {
            clearState();
            if (this.ndCountdownPts[event.detail]) {
                this.ndCountdown.setPosition(this.ndCountdownPts[event.detail]);
            }
            this.ndPlayerHandle.active = event.detail == 0;
        });

        this.ndSingleGame.on(Event.S2C_TABLE_SYNC, (event) => {
            var arrPokers = event.detail.data;
            var nPlayerIndex =event.detail.index;
            var cs = this.ndCardStacks[nPlayerIndex] 
            if (cs) {
                var com = cs.getComponent('CardStack');
                com.resetCards(arrPokers);
            }

            if (nPlayerIndex == 0) {
                var comCard = this.ndPlayerCardStack.getComponent('CardStack');
                comCard.removeCards(arrPokers); 
            }
        });

        this.ndSingleGame.on(Event.S2C_GAME_END, (event) => {
            this.ndPlayerHandle.active = false;
            console.log('Game End');
        });

        this.node.on(Event.DEAL_BEGIN, event => {
        });

        this.node.on(Event.DEAL_FINISH, event => {
            var com = this.ndPlayerCardStack.getComponent('CardStack');
            com.sort();
        });

        this.node.on(Event.DEAL_TO_LAST, event => {
            var com = this.ndLastLeftCount.getComponent('LeftCount');
            com.addCount();
        });

        this.node.on(Event.DEAL_TO_NEXT, event => {
            var com = this.ndNextLeftCount.getComponent('LeftCount');
            com.addCount();
        });

        this.node.on(Event.DEAL_TO_SELF, event => {
            var com = this.ndPlayerCardStack.getComponent('CardStack');
            com.showOneByOne();
        });
    },

    showOutputCards: function (arrCards, index) {
        this.ndCardStacks.forEach((cardstack, i) => {
            var component = cardstack.getComponent('CardStack');
            if (index === i ) {
                component.resetCards(arrCards);
            } else {
                component.clearCards();
            }
        })
    },

    onBtnElectionCancel: function () {
        this.ndSingleGame.emit(Event.C2S_CALL_LORDER, {
            playerIndex: 0,
            bElected: false
        })
    },

    onBtnElectionComfirm: function () {
        this.ndSingleGame.emit(Event.C2S_CALL_LORDER, {
            playerIndex: 0,
            bElected: true
        })
    },

    onBtnGrabCancel: function () {
        this.ndSingleGame.emit(Event.C2S_GRAB_LORDER, {
            playerIndex: 0,
            bGrabed: false
        })
    },

    onBtnGrabComfirm: function () {
        this.ndSingleGame.emit(Event.C2S_GRAB_LORDER, {
            playerIndex: 0,
            bGrabed: true
        })
    },

    onBtnRaiseCancel: function () {
        this.ndSingleGame.emit(Event.C2S_RAISE_BET, {
            playerIndex: 0,
            nMultiple: 0
        })
    },

    onBtnRaiseDouble: function () {
        this.ndSingleGame.emit(Event.C2S_RAISE_BET, {
            playerIndex: 0,
            nMultiple: 2
        })
    },

    onBtnRaiseSuper: function () {
        this.ndSingleGame.emit(Event.C2S_RAISE_BET, {
            playerIndex: 0,
            nMultiple: 4
        })
    },

    onBtnFold: function () {
        this.ndSingleGame.emit(Event.C2S_PLAYER_HANDLE, {
            playerIndex: 0,
            data: [],
        })
    },

    onBtnOutput: function () {
        var com = this.ndPlayerCardStack.getComponent('CardStack');
        var selectData = com.getSelectData();
        this.ndSingleGame.emit(Event.C2S_PLAYER_HANDLE, {
            playerIndex: 0,
            data: selectData,
        })
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
