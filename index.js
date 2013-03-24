

//DANGER! BUG!
//if two streams have the same key,
//one must deterministically overwrite the other
//each stream probably represents an SST,
//so left most wins, or something.

//merge streams in order
var pull = require('pull-stream')
var nextTick = process.nextTick

module.exports = function (strms, sort) {
  var queue = [], ended = [], next = [], ready = true, ended = false

  var output = pull.pushable()

  //setup buffers for each stream
  for(var i = 0; i < strms.length; i++) {
    next[i] = strms[i]
    queue[i] = []
  }

  function min () {
    var l = strms.length, min = Infinity, j
   
    for(var i = 0; i < strms.length; i++) {
      if(queue[i] !== true) {
        if(!queue[i].length) return null
        if(min > queue[i][0]) {
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
      nextTick(drain)
    })
  }

  function drain () {
    if(!ready || ended) return

    var j = min()
    if(j != null) {
      ready = false
      output.push(queue[j].shift(), function (err) {
        if(err) //abandon all the streams.
          throw err //TEMPORARY
        ready = true; nextTick(drain)
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
