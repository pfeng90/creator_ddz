var expect = require('chai').expect;
var Pokers = require('./../assets/Script/lib/pokers');
describe('Pokers', function() {
  describe('#sortPokers()', function() {
    it('should sort the pokers.', function() {
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
  
  describe('#findBiggerPokers()', function() {
    it('findBiggerPokers.', function() {
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
  });
});