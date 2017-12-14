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
        lbAlert: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    onEnable: function () {
        var anim = this.getComponent(cc.Animation);
        anim.play();
    },

    onAniFadeEnd: function() {
        this.node.active = false;
    },

    showAlert: function (msg) {
        this.lbAlert.string = msg;
        this.node.active = true;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
