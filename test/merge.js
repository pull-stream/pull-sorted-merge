var merge = require('../')
var pull  = require('pull-stream')
var test  = require('tape')

var w = 5, l = 20, as = []

function forwards (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}

function reverse (a, b) {
  return forwards(a, b) * -1
}

while(w--) {
  as[w] = []
  var m = l
  while(m--)
    as[w].push(Math.round(Math.random() * 1000)/ 1000)
  as[w].sort(forwards)
}

process.on('uncaughException', console.error)

test('merge random streams', function (t) {


  merge(as.map(function (a) {
      return pull.values(a)
    }), forwards)
    .pipe(pull.collect(function (err, actual) {
        t.notOk(err)
        var expected = as.reduce(function (a, b) {
          return a.concat(b)
        }).sort()

        t.deepEqual(actual, expected)
        t.end()
        console.log('passed!')
    }))

})


test('merge random streams reverse', function (t) {

  var as2 = as.map(function (e) {
    return e.slice().reverse()
  })

  merge(as2.map(function (a) {
      return pull.values(a)
    }), reverse)
    .pipe(pull.collect(function (err, actual) {
        t.notOk(err)
        var expected = as2.reduce(function (a, b) {
          return a.concat(b)
        }).sort().reverse()

        t.deepEqual(actual, expected)
        t.end()
        console.log('passed!')
    }))

})

