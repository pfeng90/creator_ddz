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
        lbCount : cc.Label,
        _nCount : 0,
        nCount : {
            type: cc.Integer,
            default: 0,
        },

        _funcTimeout: null,
    },

    _count : function () {
        if (this._nCount > 0) {
            this._nCount--;
            this.lbCount.string = this._nCount;
        } else {
            this.unschedule(this._count);
            if (typeof this._funcTimeout === 'function') {
                this._funcTimeout();
            }
        }
    },

    // use this for initialization
    onLoad: function () {
    },

    onEnable: function () {
        if (this.nCount > 0) {
            this.setCount(this.nCount);
        }
    },

    onDisable: function () {
        this.unschedule(this._count);
    },

    setCount: function (nCount, funcTimeout) {
        if (Number.isInteger(nCount)) {
            this._nCount = nCount;
            this._funcTimeout = funcTimeout;
            this.lbCount.string = this._nCount;
            this.unschedule(this._count);
            this.schedule(this._count, 1);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
