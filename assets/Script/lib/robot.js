const Pokers = require('pokers');

class Robot {
    constructor(arrHanderPokers) {
        this.arrHanderPokers = arrHanderPokers;
    }

    removeHandlePoker(arrPokers) {
        this.arrHanderPokers = this.arrHanderPokers.filter(poker => !arrPokers.includes(poker));
    }

    findBiggerPokers(pokerType) {
        return Pokers.findBiggerPokers(this.arrHanderPokers, pokerType);
    }

    outputPoker() {
        return this.arrHanderPokers[0];
    }
}