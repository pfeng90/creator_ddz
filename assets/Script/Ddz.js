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
        desktop: cc.Node,
        cardPrefab: cc.Prefab
        
    },

    // use this for initialization
    onLoad: function () {
        var card = cc.instantiate(this.cardPrefab);
        this.desktop.addChild(card);
        var cardRender = card.getComponent('Player');
        cardRender.init({bIsSelf: true, name: '男农民', coin: 3000});
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
