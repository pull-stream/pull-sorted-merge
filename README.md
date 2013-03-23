# pull-stream-merge

merge a series of pull-streams into one pull-stream.

``` js
var merge = require('pull-stream-merge')
var pull  = require('pull-stream')

merge([stream1, stream2, stream3], sort)
  .pipe(pull.log())
```

`Merge` assumes that the each pull streams are in order.

## License

MIT
