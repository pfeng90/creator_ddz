var State = require('state.com');

var instance;
var model;

function on (message) {
    return function (msgToEvaluate) {
        return msgToEvaluate === message;
    };
}

var evaluating = false;

exports = {
    StateType : {
        Prepare: 0,
        Search: 1,
        Playing: 2,
        Settled: 3,
    },

    StateEvent: {
        Prepare: 'prepare',
        Search: 'search',
        Playing: 'playing', 
        Settled: 'settle',
        Continue: 'continue',
    },

    init: function (delegate) {
        // send log messages, warnings and errors to the console
        // State.console = console;

        model = new State.StateMachine("root");
        var initial = new State.PseudoState("init-root", model, State.PseudoStateKind.Initial);

        // 当前这一把的状态

        var prepare = new State.State('准备', model);
        var search = new State.State('搜寻玩家', model);
        var playing = new State.State('开局', model);
        var settled = new State.State('结算', model);

        initial.to(prepare);
        prepare.to(search).when(on(this.StateEvent.Search));
        search.to(playing).when(on(this.StateEvent.Playing));
        playing.to(settled).when(on(this.StateEvent.Settled));
        settled.to(prepare).when(on(this.StateEvent.Prepare));
        settled.to(search).when(on(this.StateEvent.Continue));

        prepare.entry( () => {
            delegate.onStateChanged(this.StateType.Prepare);
        });

        search.entry ( () => {
            delegate.onStateChanged(this.StateType.Search);
        });

        playing.entry ( () => {
            delegate.onStateChanged(this.StateType.Playing);
        });

        settled.entry ( () => {
            delegate.onStateChanged(this.StateType.Settled);
        })

        // create a State machine instance
        instance = new State.StateMachineInstance("fsm");
        State.initialise(model, instance);
    },

    changeState: function (stateEvent) {
        this._evaluate(stateEvent);
    },

    _evaluate: function (message) {
        if (evaluating) {
            // can not call fsm's evaluate recursively
            setTimeout(function () {
                State.evaluate(model, instance, message);
            }, 1);
            return; 
        }
        evaluating = true;
        State.evaluate(model, instance, message);
        evaluating = false;
    },

    _getInstance: function () {
        return instance;
    },

    _getModel: function () {
        return model;
    }
};

module.exports = exports;
