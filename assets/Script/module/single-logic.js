const State = require('state.com');

class SingleLogic {
    constructor(delegate) {
        this.delegate = delegate;
        this.model = null;
        this.instance = null;
        this._initState();
    }

    _initState() {
        this.model = new State.StateMachine("root");
        let initial = new State.PseudoState("init-root", this.model, State.PseudoStateKind.Initial);

        // 当前这一把的状态

        let idle = new State.State('等待', this.model);
        let deal = new State.State('发牌', this.model);
        let elect = new State.State('选举地主', this.model);
        let raise = new State.State('加倍', this.model);
        let play = new State.State('操作', this.model);

        initial.to(idle);

        idle.entry( () => {
            this.delegate.onStateChange(SingleLogic.StateType.Idle);
        });

        deal.entry ( () => {
        });

        // create a State machine instance
        this.instance = new State.StateMachineInstance("fsm");
        State.initialise(this.model, this.instance);
    }

    _evaluate(msg) {
        if (this.evaluating) {
            // can not call fsm's evaluate recursively
            setTimeout(() => {
                State.evaluate(this.model, this.instance, msg);
            }, 1);
            return; 
        }
        this.evaluating = true;
        State.evaluate(this.model, this.instance, msg);
        this.evaluating = false;
    }
}

SingleLogic.StateType = {
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
};

SingleLogic.StateEvent = {
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
};

module.exports = SingleLogic;