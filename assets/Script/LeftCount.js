cc.Class({
    extends: cc.Component,

    properties: {
        lbCount: cc.Label,
        _nCount: 0,
    },

    _display: function () {
        this.lbCount.string = this._nCount;
        this.node.active = this._nCount > 0;
    },

    // use this for initialization
    onLoad: function () {
        this._display();
    },

    setCount: function (count) {
        if (Number.isInteger(count)) {
            this._nCount = count;
            this._display();
        }
    },

    addCount: function () {
        this._nCount++;
        this._display();
    },

    reset: function () {
        this._nCount = 0;
        this._display();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
