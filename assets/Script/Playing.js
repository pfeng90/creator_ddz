var fsm = require('play-fsm');
var event = require('event');

cc.Class({
    extends: cc.Component,

    properties: {
        ndCountdown : cc.Node,
        ndCountdownPts : [cc.Vec2],
        ndCardStacks : [cc.Node],
        ndElectionCall : cc.Node,
        ndElectionGrab : cc.Node,
        ndLastLeftCount : cc.Node,
        ndNextLeftCount : cc.Node,
        ndPlayerCardStack : cc.Node,
        ndDeal : cc.Node,
        ndPokerData: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.ndElectionCall.active = false;
        this.ndElectionGrab.active = false; 

        fsm.init(this);

        this.node.on(event.DEAL_FINISH, function (event) {
            fsm.changeState(fsm.StateEvent.Elect);
        });

        this.node.on(event.DEAL_TO_LAST, event => {
            var com = this.ndLastLeftCount.getComponent('LeftCount');
            com.addCount();
        });

        this.node.on(event.DEAL_TO_NEXT, event => {
            var com = this.ndNextLeftCount.getComponent('LeftCount');
            com.addCount();
        });

        this.node.on(event.DEAL_TO_SELF, event => {
            var com = this.ndPlayerCardStack.getComponent('CardStack');
            com.showOneByOne();
        });
    },

    onEnable: function () {
        fsm.changeState(fsm.StateEvent.Deal);
    },

    onStateChanged: function (st) {
        this.ndElectionCall.active = st === fsm.StateType.ElectCall;
        this.ndElectionGrab.active = st === fsm.StateType.ElectGrab;
        this.ndDeal.active = st === fsm.StateType.Deal;
        switch (st) {
            case fsm.StateType.Deal:
                var pokerdata = this.ndPokerData.getComponent('PokerData');
                var com = this.ndPlayerCardStack.getComponent('CardStack');
                com.init(pokerdata.getPlayerPokers());
                break;
            case fsm.StateType.Elect:
                fsm.changeState(fsm.StateEvent.ElectPrev);
                break;
            case fsm.StateType.ElectNext:
            case fsm.StateType.ElectPrev:
                setTimeout(() => {
                    fsm.changeState(fsm.StateEvent.ElectPass);
                }, 2000);
                break;
            default :
                break;
        };

        // 设置计时器
        if (this.ndCountdown) {
            var com = this.ndCountdown.getComponent('Countdown');
            if (com) {
                com.setCount(30);
            }
            switch (st) {
                case fsm.StateType.ElectCall:
                case fsm.StateType.ElectGrab:
                case fsm.StateType.PlaySelf:
                    this.ndCountdown.active = true;
                    this.ndCountdown.setPosition(this.ndCountdownPts[0]);
                    break;
                case fsm.StateType.ElectNext:
                case fsm.StateType.PlayNext:
                    this.ndCountdown.active = true;
                    this.ndCountdown.setPosition(this.ndCountdownPts[1]);
                    break;
                case fsm.StateType.ElectPrev:
                case fsm.StateType.PlayPrev:
                    this.ndCountdown.active = true;
                    this.ndCountdown.setPosition(this.ndCountdownPts[2]);
                    break;
                default :
                    this.ndCountdown.active = false;
                    break; 
            }
        }
    },

    showOutputCards: function (arrCards, index) {
        this.ndCardStacks.forEach((cardstack, i) => {
            var component = cardstack.getComponent('CardStack');
            console.log(component);
            if (index === i ) {
                component.resetCards(arrCards);
            } else {
                component.clearCards();
            }
        })
    },

    onBtnElectionCancel: function () {
        fsm.changeState(fsm.StateEvent.ElectPass);
    },

    onBtnElectionComfirm: function () {
        fsm.changeState(fsm.StateEvent.ElectPass);
    },

    onBtnRaiseCancel: function () {

    },

    onBtnRaiseDouble: function () {

    },

    onBtnRaiseSuper: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
