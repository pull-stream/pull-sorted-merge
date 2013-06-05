

//DANGER! BUG!
//if two streams have the same key,
//one must deterministically overwrite the other
//each stream probably represents an SST,
//so left most wins, or something.

//actuall, I may want to order some streams

//merge streams in order
var pushable = require('pull-pushable')
var tick = (
  'undefined' === typeof setImmediate
    ? process.nextTick 
    : setImmediate
  )

module.exports = function (strms, sort) {
  var queue = [], ended = [], next = [], ready = true, ended = false

  var output = pushable()

  if(!strms.length) {
    output.end()
    return output
  }

  //setup buffers for each stream
  for(var i = 0; i < strms.length; i++) {
    next[i] = strms[i]
    queue[i] = []
  }

  function min () {
    var l = strms.length, min = null, j
    for(var i = 0; i < strms.length; i++) {
      if(queue[i] !== true) {
        if(!queue[i].length) return null
        if(null === min || sort(queue[i][0], min) < 0) {
          min = queue[i][0]
          j = i
        }
      }
    }
    return j
  }

  function getNext(i) {
    if(queue[i] === true) return
    next[i](null, function (end, data) {
      if(end) queue [i] = true
      else    queue[i].push(data)
      tick(drain)
    })
  }

  function drain () {
    if(!ready || ended) return

    //todo: option to pull from multiple streams at once,
    //if two streams have an equally sorting value.

    var j = min()
    if(j != null) {
      ready = false
      output.push(queue[j].shift(), function (err) {
        if(err) //abandon all the streams.
          throw err //TEMPORARY
        ready = true; tick(drain)
      })
      getNext(j)
    }

    if(queue.every(function (e) {return e === true})) {
      ended = true
      output.end()
    }
  }

  strms.forEach(function(_, i) {
    getNext(i)
  })

  return output
}
