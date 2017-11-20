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
        point: cc.Sprite,
        point_back: cc.Sprite,
        suit: cc.Sprite,
        suit_big: cc.Sprite,
        texPointRed: {
            default: [],
            type: [cc.SpriteFrame]
        },
        texPointBlack: {
            default: [],
            type: [cc.SpriteFrame]
        },
        texSuit: {
            default: [],
            type: [cc.SpriteFrame]
        },
        texSuitBig: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function(card) {
        var bIsJoker = card.point > 15;
        var bIsRed = false;

        if (bIsJoker)
        {
            this.suit.node.active = false;
            this.suit_big.spriteFrame = this.texSuitBig[card.point > 16 ? 4 : 5];
            bIsRed = card.point > 16;
        }
        else
        {
            this.suit.node.active = true;
            this.suit.spriteFrame = this.texSuit[card.suit];
            this.suit_big.spriteFrame = this.texSuitBig[card.suit];
            bIsRed = card.suit % 2 == 0 ;
        }

        if (bIsRed)
        {
            this.point.spriteFrame = this.texPointRed[card.point];
            this.point_back.spriteFrame = this.texPointRed[card.point];
        }
        else
        {
            this.point.spriteFrame = this.texPointBlack[card.point];
            this.point_back.spriteFrame = this.texPointBlack[card.point];
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
