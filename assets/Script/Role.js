cc.Class({
    extends: cc.Component,

    properties: {
        spineNode : sp.Skeleton,
        spineDatas : [sp.SkeletonData],
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (spineIndex) {
        if (!! this.spineDatas[spineIndex])
        {
            this.spineNode.skeletonData = this.spineDatas[spineIndex];
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
