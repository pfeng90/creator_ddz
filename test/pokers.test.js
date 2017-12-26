require('app-module-path').addPath(__dirname+'/../assets/Script/lib');
var expect = require('chai').expect;
var Pokers = require('pokers');
describe('Pokers', function () {
    describe('#sortPokers()', function () {
        it('should sort the pokers.', function () {
            expect(Pokers.sortPokers([
                {
                    point: 5,
                    suit: 2,
                },
                {
                    point: 3,
                    suit: 2,
                },
                {
                    point: 4,
                    suit: 2,
                },
            ])).eql([{
                    point: 3,
                    suit: 2,
                },
                    {
                        point: 4,
                        suit: 2,
                    },
                    {
                        point: 5,
                        suit: 2,
                    }]
            );
        });
    });

    describe('#findBiggerPokers()', function () {
        it('findBiggerPokers - single.', function () {
            expect(Pokers.findBiggerPokers([
                {
                    point: 5,
                    suit: 2,
                },
                {
                    point: 3,
                    suit: 2,
                },
                {
                    point: 4,
                    suit: 2,
                },
            ], [
                {
                    point: 3,
                    suit: 2,
                }
            ])).eql([
                    {
                        point: 4,
                        suit: 2,
                    }
                ]
            );
        });

        it('findBiggerPokers - pair.', function () {
            expect(Pokers.findBiggerPokers([
                {
                    point: 5,
                    suit: 2,
                },
                {
                    point: 5,
                    suit: 3,
                },
                {
                    point: 4,
                    suit: 2,
                },
            ], [
                {
                    point: 3,
                    suit: 2,
                },
                {
                    point: 3,
                    suit: 1,
                }
            ])).eql([
                    {
                        point: 5,
                        suit: 2,
                    },
                    {
                        point: 5,
                        suit: 3,
                    }
                ]
            );
        });

        it('findBiggerPokers - three.', function () {
            expect(Pokers.findBiggerPokers([
                {
                    point: 5,
                    suit: 2,
                },
                {
                    point: 5,
                    suit: 3,
                },
                {
                    point: 4,
                    suit: 2,
                },
                {
                    point: 5,
                    suit: 1,
                }
            ], [
                {
                    point: 3,
                    suit: 2,
                },
                {
                    point: 3,
                    suit: 1,
                },
                {
                    point: 3,
                    suit: 0,
                }
            ])).eql([
                    {
                        point: 5,
                        suit: 2,
                    },
                    {
                        point: 5,
                        suit: 3,
                    },
                    {
                        point: 5,
                        suit: 1,
                    }
                ]
            );
        });

        it('findBiggerPokers - three_one.', function () {
            expect(Pokers.findBiggerPokers([
                {
                    point: 5,
                    suit: 2,
                },
                {
                    point: 5,
                    suit: 3,
                },
                {
                    point: 4,
                    suit: 2,
                },
                {
                    point: 5,
                    suit: 1,
                }
            ], [
                {
                    point: 3,
                    suit: 2,
                },
                {
                    point: 3,
                    suit: 1,
                },
                {
                    point: 3,
                    suit: 0,
                },
                {
                    point: 6,
                    suit: 0,
                }
            ])).eql([
                    {
                        point: 5,
                        suit: 2,
                    },
                    {
                        point: 5,
                        suit: 3,
                    },
                    {
                        point: 5,
                        suit: 1,
                    },
                    {
                        point: 4,
                        suit: 2,
                    }
                ]
            );
        });

        it('findBiggerPokers - three_two.', function () {
            expect(Pokers.findBiggerPokers([
                {
                    point: 5,
                    suit: 2,
                },
                {
                    point: 5,
                    suit: 3,
                },
                {
                    point: 4,
                    suit: 2,
                },
                {
                    point: 5,
                    suit: 1,
                },
                {
                    point: 7,
                    suit: 2,
                },
                {
                    point: 7,
                    suit: 1,
                },
                {
                    point: 9,
                    suit: 1,
                },
            ], [
                {
                    point: 3,
                    suit: 2,
                },
                {
                    point: 3,
                    suit: 1,
                },
                {
                    point: 3,
                    suit: 0,
                },
                {
                    point: 6,
                    suit: 0,
                },
                {
                    point: 6,
                    suit: 2,
                }
            ])).eql([
                    {
                        point: 5,
                        suit: 2,
                    },
                    {
                        point: 5,
                        suit: 3,
                    },
                    {
                        point: 5,
                        suit: 1,
                    },
                    {
                        point: 7,
                        suit: 2,
                    },
                    {
                        point: 7,
                        suit: 1,
                    }
                ]
            );
        });
    });
});