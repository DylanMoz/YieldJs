(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Yield = factory();
  }
})(this, function() {
	'use strict';

	class Yield {
		constructor (iter) {
			this.iterable = iter;
			this.maps = [];
		}

		map (lambda) {
			this.maps.push(lambda);
			return this;
		}

		toArray () {
			return [...this];
		}

		* [Symbol.iterator]() {
			for(let v of this.iterable) {
				for (let m of this.maps) {
					v = m(v);
				}
				yield v;
			}
		}
	}

	return function(iterable) { return new Yield(iterable); };
});