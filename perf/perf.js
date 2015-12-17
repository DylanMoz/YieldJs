'use strict';

const Lazy = require('lazy.js');
const Yield = require ('../yield');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const arr = Lazy.generate(Math.random).take(100).toArray();
Yield(arr).map(a => a * a).toArray();
suite
.add('Map - Yield', function() {
  Yield(arr).map(a => a * a).toArray();
})
.add('Map - Lazy', function() {
  Lazy(arr).map(a => a * a).toArray();
})
.on('complete', function() {
  console.log(this);
})
.run();
