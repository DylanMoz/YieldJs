'use strict';

const assert = require('assert');
const Yield = require('../yield')

describe('Yield', function() {
  it('should not mutate the iterable it is given', function () {
    let y = Yield([5, 10, 15]);
    let result = [];
    for (let x of y) {
      result.push(x);
    }

    assert.deepEqual([5, 10, 15], y.toArray());
    assert.deepEqual([5, 10, 15], result);
  });

  it('should accept generator functions', function () {
    let y = Yield(function* fn () {
      yield 5;
      yield 10;
      yield 15;
    });

    let result = [];
    for (let x of y) {
      result.push(x);
    }

    assert.deepEqual([5, 10, 15], y.toArray());
    assert.deepEqual([5, 10, 15], result);
  });
});

describe('Map', function() {
  it('should return the mapped results of the original array when calling toArray()', function () {

    assert.deepEqual([1, 4, 9], Yield([1,2,3]).map(a => a * a).toArray());

    assert.deepEqual([1, 16, 81], Yield([1,2,3]).map(a => a * a).map(a => a * a).toArray());

    assert.deepEqual([9, 16, 25], Yield([1,2,3]).map(a => a + 2).map(a => a * a).toArray());

    assert.deepEqual([3, 4, 1], Yield([1,2,3]).map(a => a + 2).map(a => a * a).map(a => a % 6).toArray());
  });
});

describe('Filter', function() {
  it('should return the filtered results of the original array when calling toArray()', function () {

    assert.deepEqual([1, 3, 5, 7, 9], Yield([1,2,3,4,5,6,7,8,9,10]).filter(a => a % 2 == 1).toArray());

    assert.deepEqual([], Yield([1,2,3,4,5,6,7,8,9,10]).filter(a => a > 10).toArray());

    assert.deepEqual([5], Yield([1,2,3,4,5,6,7,8,9,10]).filter(a => a === 5).toArray());
  });
});

describe('Skip', function() {
  it('should skip the first n elements of a generator', function () {

    assert.deepEqual([8,9,10], Yield([1,2,3,4,5,6,7,8,9,10]).skip(7).toArray());

    assert.deepEqual([], Yield([1,2,3,4,5,6,7,8,9,10]).skip(10).toArray());

    assert.deepEqual([], Yield([1,2,3,4,5,6,7,8,9,10]).skip(18).toArray());

    assert.deepEqual([1,2,3,4,5,6,7,8,9,10], Yield([1,2,3,4,5,6,7,8,9,10]).skip(0).toArray());
    assert.deepEqual([1,2,3,4,5,6,7,8,9,10], Yield([1,2,3,4,5,6,7,8,9,10]).skip(-5).toArray());
  });
});

describe('Reverse', function() {
  it('should reverse the order of an iterable', function () {

    assert.deepEqual([10,9,8,7,6,5,4,3,2,1], Yield([1,2,3,4,5,6,7,8,9,10]).reverse().toArray());
    assert.deepEqual([], Yield([]).reverse().toArray());
  });
});

describe('Chunk', function() {
  it('should break the iterable into equally sized arrays', function () {

    assert.deepEqual([[1,2,3,4], [5,6,7,8], [9,10]], Yield([1,2,3,4,5,6,7,8,9,10]).chunk(4).toArray());

    assert.deepEqual([], Yield([]).chunk(10).toArray());

    assert.deepEqual([[1,2,3,4,5]], Yield([1,2,3,4,5]).chunk(18).toArray());
  });
});
