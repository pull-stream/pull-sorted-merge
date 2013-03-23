
var merge = require('../')
var pull  = require('pull-stream')
var test  = require('tape')

test('merge random streams', function (t) {
var w = 5, l = 20, as = []

while(w--) {
  as[w] = []
  var m = l
  while(m--)
    as[w].push(Math.round(Math.random() * 1000)/ 1000)
  as[w].sort()
}

var i = 0

var actual = []

merge(as.map(function (a) {
    return pull.readArray(a)
  }), function (a, b) {
    return a - b
  })
  .pipe(function(read) {

    read(null, function next (end, data) {
      console.log('*', data, i++, end)

      if(data != null) {
        actual.push(data)
        read(null, next)
      }

      if(end) {
        var expected = as.reduce(function (a, b) {
          return a.concat(b)
        }).sort()

        t.deepEqual(actual, expected)
        t.end()
        console.log('passed!')
      }
    })
  })

})
