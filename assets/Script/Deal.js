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
            allCardNodes.forEach((card, ci) => {
                this.scheduleOnce(() => {
                    var act = cc.moveTo(dTime, ptTargets[ci % nTargetCount]);
                    card.runAction(act);
                }, ci * dTime);
            })
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
