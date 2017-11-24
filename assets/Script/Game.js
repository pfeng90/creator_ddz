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
        ndPlayerPos: [cc.Node],
        playerPrefab: cc.Prefab,
        cardstackPrefab: cc.Prefab,
        
    },

    // use this for initialization
    onLoad: function () {
        this.ndPlayerPos.forEach((ndPlayer, i) => {
            var player = cc.instantiate(this.playerPrefab);
            ndPlayer.addChild(player);
            var playerCom = player.getComponent('Player');
            playerCom.init({bIsSelf: i === 0, name: 'kkkkk', coin: 30000});
        })
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
