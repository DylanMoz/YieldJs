const assert = require('assert');
const Yield = require('../yield')
describe('Map', function() {
	it('should return the mapped results of the original array when calling toArray()', function () {
	  
	  assert.deepEqual([1, 4, 9], Yield([1,2,3]).map(a => a * a).toArray() );

	  assert.deepEqual([1, 16, 81], Yield([1,2,3]).map(a => a * a).map(a => a * a).toArray() );

	  assert.deepEqual([9, 16, 25], Yield([1,2,3]).map(a => a + 2).map(a => a * a).toArray() );
	});
});