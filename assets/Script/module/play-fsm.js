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
        Idle: 0,
        Deal: 1,
        Elect: 2,
        ElectCall: 3,
        ElectNext: 4,
        ElectPrev: 5,
        ElectGrab: 6,
        Raise: 7,
        Play: 8,
        PlaySelf: 9,
        PlayNext: 10,
        PlayPrev: 11,
    },

    StateEvent: {
        Idle : 'idle',
        Deal: 'deal',
        Elect: 'elect',
        ElectCall: 'elect_call',
        ElectNext: 'elect_next',
        ElectPrev: 'elect_prev',
        ElectPass: 'elect_pass',
        Raise: 'raise', 
        Play: 'play',
        PlaySelf: 'play_self',
        PlayNext: 'play_next',
        PlayPrev: 'play_prev',
        PlayPass: 'play_pass',
    },

    init: function (delegate) {
        // send log messages, warnings and errors to the console
        // State.console = console;

        model = new State.StateMachine("root");

        // 开局后的状态

        var initialPlaying = new State.PseudoState("init-playing", model, State.PseudoStateKind.Initial);
        
        var idle = new State.State('等待', model);
        var deal = new State.State('发牌', model);
        var elect = new State.State('选举地主', model);
        var raise = new State.State('加倍', model);
        var play = new State.State('操作', model);

        initialPlaying.to(idle);
        idle.to(deal).when(on(this.StateEvent.Deal));
        deal.to(elect).when(on(this.StateEvent.Elect));
        elect.to(raise).when(on(this.StateEvent.Raise));
        raise.to(play).when(on(this.StateEvent.Play));
        play.to(idle).when(on(this.StateEvent.Idle));


        deal.entry(() => {
            delegate.onStateChanged(this.StateType.Deal);
        });

        raise.entry(() => {
            delegate.onStateChanged(this.StateType.Raise);
        });


        // 抢地主状态
        var initialElect = new State.PseudoState("init elect", elect, State.PseudoStateKind.Initial);
        
        var elect_init = new State.State('选举地主_init', elect);
        var elect_call = new State.State('选举地主_叫地主', elect);
        var elect_next = new State.State('选举地主_下家', elect);
        var elect_prev = new State.State('选举地主_上家', elect);
        var elect_grab = new State.State('选举地主_抢地主', elect);

        initialElect.to(elect_init);
        elect_init.to(elect_call).when(on(this.StateEvent.ElectCall));
        elect_init.to(elect_next).when(on(this.StateEvent.ElectNext));
        elect_init.to(elect_prev).when(on(this.StateEvent.ElectPrev));
        elect_call.to(elect_next).when(on(this.StateEvent.ElectPass));
        elect_next.to(elect_prev).when(on(this.StateEvent.ElectPass));
        elect_prev.to(elect_grab).when(on(this.StateEvent.ElectPass));
        elect_grab.to(elect_next).when(on(this.StateEvent.ElectPass));

        elect_init.entry(() => {
            delegate.onStateChanged(this.StateType.Elect);
        });

        elect_call.entry(() => {
            delegate.onStateChanged(this.StateType.ElectCall);
        });

        elect_next.entry(() => {
            delegate.onStateChanged(this.StateType.ElectNext);
        });

        elect_prev.entry(() => {
            delegate.onStateChanged(this.StateType.ElectPrev);
        });

        elect_grab.entry(() => {
            delegate.onStateChanged(this.StateType.ElectGrab);
        });


        // 打牌状态
        var initialPlay = new State.PseudoState("init play", play, State.PseudoStateKind.Initial);

        var play_init = new State.State('打牌_init', play);
        var play_self = new State.State('玩家操作', play);
        var play_next = new State.State('下家操作', play);
        var play_prev = new State.State('上家操作', play);

        play_init.to(play_self).when(on(this.StateEvent.PlaySelf));
        play_init.to(play_next).when(on(this.StateEvent.PlayNext));
        play_init.to(play_prev).when(on(this.StateEvent.PlayPrev));
        play_self.to(play_next).when(on(this.StateEvent.PlayPass));
        play_next.to(play_prev).when(on(this.StateEvent.PlayPass));
        play_prev.to(play_self).when(on(this.StateEvent.PlayPass));


        play_self.entry(() => {
            delegate.onStateChanged(this.StateType.PlaySelf);
        });


        play_next.entry(() => {
            delegate.onStateChanged(this.StateType.PlayNext);
        });


        play_prev.entry(() => {
            delegate.onStateChanged(this.StateType.PlayPrev);
        });


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
