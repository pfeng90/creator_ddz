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
        ndEnemy: cc.Node,
        ndSelf: cc.Node,
        lbNames: [cc.Label],
        lbCoins: [cc.Label],
        spEscrow: [cc.Sprite],
        avatarPrefab: cc.Prefab,
        rolePrefab: cc.Prefab,
        ndEnemyPos: cc.Node,
        ndSelfPos: cc.Node,
        _ndAvator: cc.Node,
        _ndRole: cc.Node,
        _bIsSelf : Boolean,
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (playerData) {
        this._bIsSelf = playerData.bIsSelf === true;
        this._ndAvator = cc.instantiate(this.avatarPrefab);
        if (this._bIsSelf)
        {
            this.ndSelfPos.addChild(this._ndAvator);
        }
        else
        {
            this.ndEnemyPos.addChild(this._ndAvator);
        }
        this.ndEnemy.active = !this._bIsSelf;
        this.ndSelf.active = this._bIsSelf;

        this.lbNames.forEach(label => {
            label.string = playerData.name;
        });

        this.lbCoins.forEach(label => {
            label.string = playerData.coin;
        });
    },

    setRole: function (roleIndex) {
        this._ndAvator.active = false;
        this._ndRole = this._ndRole || cc.instantiate(this.rolePrefab);
        var comRole = this._ndRole.getComponent('Role');
        comRole.init(roleIndex);
    },

    onBtnSelfClicked: function (event, customEventData) {
        console.log('click self');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
