const Pokers = require('pokers');

class Robot {
    constructor(arrHanderPokers) {
        this.arrHanderPokers = arrHanderPokers;
    }

    removeHandlePoker(arrPokers) {
        this.arrHanderPokers = this.arrHanderPokers.filter(poker => !arrPokers.includes(poker));
    }

    findBiggerPokers(pokers) {
        if (pokers.length === 0) {
            return this.outputPoker();
        } else {
            return Pokers.findBiggerPokers(this.arrHanderPokers, pokers);
        }
    }

    outputPoker() {
        return [this.arrHanderPokers[0]];
    }
}

module.exports = Robot;