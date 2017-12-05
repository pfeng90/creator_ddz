var Event = require('event');

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
        ndSingleGame: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.ndElectionCall.active = false;
        this.ndElectionGrab.active = false; 

        this.ndSingleGame.on(Event.DEAL_POKERS, (event) => {
            var comDeal = this.ndDeal.getComponent('Deal');
            comDeal.deal(event.detail.lorderPoker);

            var comCard = this.ndPlayerCardStack.getComponent('CardStack');
            comCard.init(event.detail.handPokers);
        });

        this.ndSingleGame.on(Event.CALL_LORDER, (event) => {
            var playerIndex = event.detail;
            this.ndCountdown.active = true;
            this.ndCountdown.setPosition(this.ndCountdownPts[playerIndex]);
            if (playerIndex == 0) {
                this.ndElectionCall.active = true;
            }
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
    },

    onBtnElectionComfirm: function () {
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
