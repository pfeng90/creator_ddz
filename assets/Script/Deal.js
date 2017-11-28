var pokers = require('pokers');
var event = require('event');

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
        ndCardStacks: cc.Node,
        ptTargets: [cc.Vec2],
        ptKeyCards: [cc.Vec2],
        ndPokerData: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    onEnable : function () {
        this.deal();
    },

    deal: function () {
        var data = this.ndPokerData.getComponent('PokerData');
        data.generatePokerData();
        var lordPoker= data.getLordPoker();

        var com = this.ndCardStacks.getComponent('CardStack');
        if (com) {
            var backPokers = [];
            for (var i = 0; i < 54; i++)
            {
                backPokers.push({});
            }
            backPokers[lordPoker.index] = lordPoker.poker;
            com.resetCards(backPokers);

            var allCardNodes = com.getAllCardNodes();
            var nTargetCount = this.ptTargets.length;
            var ptCardStacks = this.ndCardStacks.getPosition();
            var sX = this.ndCardStacks.scaleX;
            var sY = this.ndCardStacks.scaleY;
            var ptTargets = this.ptTargets.map(pt => {
                var ptTar = pt.sub(ptCardStacks);
                return new cc.Vec2(ptTar.x / sX, ptTar.y / sY);
            });
            var dTime = 0.06;
            var cardNodeCount = allCardNodes.length;
            var handerCardCount = cardNodeCount - pokers.KeyCount;
            var cardindex = 0;
            var arrEvent = [
                event.DEAL_TO_SELF,
                event.DEAL_TO_NEXT, 
                event.DEAL_TO_LAST
            ]
            for (; cardindex < handerCardCount ; cardindex++) {
                (ci => {
                    var card = allCardNodes[ci];
                    this.scheduleOnce(() => {
                        var num = ci % nTargetCount;
                        var seq = cc.sequence(
                            cc.moveTo(dTime, ptTargets[num]),
                            cc.hide(),
                            cc.callFunc(() => {
                                this.node.dispatchEvent(new cc.Event.EventCustom(arrEvent[num], true));
                            }),
                        );
                        card.runAction(seq);
                    }, ci * dTime);
                })(cardindex);
            }

            var totalDelayTime = cardindex * dTime;
            var ptKeyCards = this.ptKeyCards.map(pt => {
                var ptTar = pt.sub(ptCardStacks);
                return new cc.Vec2(ptTar.x / sX, ptTar.y / sY);
            });
            for(; cardindex < cardNodeCount; cardindex++ ) {
                (ci => {
                    var card = allCardNodes[ci];
                    this.scheduleOnce(() => {
                        var arrActs = []
                        var act = cc.moveTo(dTime * 3, ptKeyCards[ci % pokers.KeyCount]);
                        act.easing(cc.easeOut(3.0));
                        arrActs.push(act);
                        var seq = cc.sequence(act);
                        if (ci === cardNodeCount - 1) {
                            var actCall = cc.callFunc(() => {
                                this.node.dispatchEvent(new cc.Event.EventCustom(event.DEAL_FINISH, true));
                            });
                            arrActs.push(actCall);
                        }
                        var seq = cc.sequence(arrActs);
                        card.runAction(seq);
                    }, totalDelayTime);
                })(cardindex);
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
