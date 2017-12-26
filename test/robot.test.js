require('app-module-path').addPath(__dirname+'/../assets/Script/lib');
var expect = require('chai').expect;
var Robot = require('robot');
describe('Robot', function () {
    describe('#outputPoker()', function () {
        it('get out put poker.', function () {
            var robot = new Robot([
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
            ]);
            expect(robot.outputPoker()).eql(
                {
                    point: 5,
                    suit: 2,
                }
            );
        });
    });
});
