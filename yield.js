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
    }

    map (lambda) {
      const that = this;
      return new Yield(function* fn () {
        for (let v of that.generator()) {
          yield lambda(v);
        }
      });
    }

    filter (lambda) {
      const that = this;
      return new Yield(function* fn () {
        let result;
        for (let v of that.generator()) {
            result = lambda(v);
            if (result) { // Truthy values are accepted
              yield v;
            }
        }
      });
    }

    skip (num) {
      const that = this;
      let iterable = that.generator();
      if (Util.isArray(iterable)) {
        this.iterable = iterable.slice(num < 0 ? 0 : num);
        return this;
      } else {
        return new Yield(function* fn () {
          let skip = 0;
          for (let v of iterable) {
            if (++skip > num) {
              yield v;
            }
          }
        });
      }

    }

    toArray () {
      return [...this];
    }

    generator () {
      return typeof this.iterable === 'function' ? this.iterable() : this.iterable;
    }

    * [Symbol.iterator] () {
      for(let v of this.generator()) {
        yield v;
      }
    }
  }

  class Util {
    static isArray (a) {
      return a.constructor === Array;
    }
  }

  return function(iterable) { return new Yield(iterable); };
});
