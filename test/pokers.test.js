require('app-module-path').addPath(__dirname + '/../assets/Script/lib');
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
                    point: 5,
                    suit: 3,
                },
                {
                    point: 4,
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
                },
                {
                    point: 9,
                    suit: 1,
                },
                {
                    point: 6,
                    suit: 1,
                },
                {
                    point: 6,
                    suit: 2,
                },
                {
                    point: 6,
                    suit: 3,
                },
                {
                    point: 10,
                    suit: 1,
                },
            ])).eql([
                {
                    "point": 4,
                    "suit": 3,
                },
                {
                    "point": 5,
                    "suit": 1,
                },
                {
                    "point": 5,
                    "suit": 2,
                },
                {
                    "point": 5,
                    "suit": 3,
                },
                {
                    "point": 6,
                    "suit": 1,
                },
                {
                    "point": 6,
                    "suit": 2,
                },
                {
                    "point": 6,
                    "suit": 3,
                },
                {
                    "point": 7,
                    "suit": 1,
                },
                {
                    "point": 7,
                    "suit": 2,
                },
                {
                    "point": 9,
                    "suit": 1,
                },
                {
                    "point": 10,
                    "suit": 1,
                }
            ]);
        });
    });

    describe('#findBiggerPokers()', function () {
        it('single.', function () {
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

        it('pair.', function () {
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

        it('three.', function () {
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
                        suit: 1,
                    },
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

        it('three_one.', function () {
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
                        suit: 1,
                    },
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
                    }
                ]
            );
        });

        it('three_two.', function () {
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
                        suit: 1,
                    },
                    {
                        point: 5,
                        suit: 2,
                    },
                    {
                        point: 5,
                        suit: 3,
                    },
                    {
                        point: 7,
                        suit: 1,
                    },
                    {
                        point: 7,
                        suit: 2,
                    }
                ]
            );
        });

        it('plane.', function () {
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
                },
                {
                    point: 9,
                    suit: 1,
                },
                {
                    point: 6,
                    suit: 1,
                },
                {
                    point: 6,
                    suit: 2,
                },
                {
                    point: 6,
                    suit: 3,
                },
                {
                    point: 10,
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
                    point: 4,
                    suit: 2,
                },
                {
                    point: 4,
                    suit: 1,
                },
                {
                    point: 4,
                    suit: 0,
                },
                {
                    point: 6,
                    suit: 0,
                },
                {
                    point: 8,
                    suit: 0,
                },
            ])).eql([
                    {
                        point: 5,
                        suit: 1,
                    },
                    {
                        point: 5,
                        suit: 2,
                    },
                    {
                        point: 5,
                        suit: 3,
                    },
                    {
                        point: 6,
                        suit: 1,
                    },
                    {
                        point: 6,
                        suit: 2,
                    },
                    {
                        point: 6,
                        suit: 3,
                    },
                    {
                        point: 4,
                        suit: 3,
                    },
                    {
                        point: 9,
                        suit: 1,
                    }
                ]
            );
        });
    });
});