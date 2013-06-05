
var merge = require('../')
var pull  = require('pull-stream')

require('tape')('empty', function (t) {
  merge([], function () {})
  .pipe(pull.collect(function (err, ary) {
    t.notOk(err)
    t.deepEqual(ary, [])
    t.end()
  }))
})
