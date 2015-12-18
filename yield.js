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

    chunk (size) {
      const that = this;
      return new Yield(function* fn () {
        let chunk = size;
        let res = [];
        for (let v of that.generator()) {
          if (chunk === 0) {
            yield res;
            res = [];
            chunk = size;
          }
          res.push(v);
          chunk--;
        }
        if (res.length !== 0) {
          yield res;
        }
      });
    }

    compact () {
      const that = this;
      return new Yield(function* fn () {
        for (let v of that.generator()) {
          if (v) {
            yield v;
          }
        }
      });
    }

    concat (...iterables) {
      const that = this;
      return new Yield(function* fn () {
        for (let v of that.generator()) {
            yield v;
        }
        for (let iterable of iterables) {
          for (let v of iterable) {
            yield v;
          }
        }
      });
    }

    compact () {
      const that = this;
      return new Yield(function* fn () {
        for (let v of that.generator()) {
          if (v) {
            yield v;
          }
        }
      });
    }

    consecutive (num) {
      if (num <= 0)
        return new Yield([]);

      const that = this;
      return new Yield(function* fn () {
        let firstReturned = false;
        let arr = [];
        for (let v of that.generator()) {
          arr.push(v);
          if (!firstReturned) {
            if (arr.length === num) {
              yield arr;
              firstReturned = true;
            }
          } else {
            yield (arr = arr.slice(1));
          }
        }

        if (firstReturned) {
          yield arr;
        }
      });
    }

    contains (value) {
      for (let v of this.generator()) {
        if (v === value) {
          return true;
        }
      }
      return false;
    }

    countBy (fn) {
      let hash = {};
      let key;
      for (let v of this.generator()) {
        key = fn(v);
        if (key in hash) {
          hash[key]++;
        } else {
          hash[key] = 0;
        }
      }
      return hash;
    }

    dropWhile (fn) {
      const that = this;
      return new Yield(function* fn () {
        let dropping = true;
        for (let v of that.generator()) {
          if (dropping) {
            if (!fn(v)) {
              dropping = false;
              yield v;
            }
          } else {
            yield v;
          }
        }
      });
    }

    each (fn) {
      for (let v of this.generator()) {
        let result = fn(v);
        if (!result) {
          break;
        }
      }
      return this;
    }

    every (fn) {
      for (let v of this.generator()) {
        if (!fn(v)) {
          return false;
        }
      }
      return true;
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

    find (fn) {
      for (let v of this.generator()) {
        if (fn(v)) {
          return v;
        }
      }
    }

    first (num) {
      const that = this;
      return new Yield(function* fn () {
        let skip = 0;
        if (!num) {
          let v = that.generator().next();
          if (!v.done) {
            yield v.value;
          }
          return;
        }
        for (let v of that.generator()) {
          if (num-- > 0) {
            yield v;
          } else {
            break;
          }
        }
      });
    }

    skip (num) {
      const that = this;
      return new Yield(function* fn () {
        let skip = 0;
        for (let v of that.generator()) {
          if (++skip > num) {
            yield v;
          }
        }
      });
    }

    reverse () {
      // CANNOT be used on infinite generators.
      const that = this;
      return new Yield(function* fn () {
        const arr = [...that.iterable];
        let i = arr.length - 1;
        while (i >= 0) {
          yield arr[i--];
        }
      });
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
