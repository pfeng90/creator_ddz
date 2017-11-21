cc.Class({
    extends: cc.Component,

    properties: {
        spBorder: cc.Sprite,
        spVip: cc.Sprite,
        texBorders : {
            default: [],
            type: [cc.SpriteFrame]
        },
        texVips: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (nVipLv, nBorderIndex) {
        if (!! this.texVips[nVipLv])
        {
            this.spVip.spriteFrame = this.texVips[nVipLv].spriteFrame;
        }

        if (!! this.texBorders[nBorderIndex])
        {
            this.spBorder.spriteFrame = this.texBorders[nBorderIndex].spriteFrame;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
