
import Kefir from 'kefir'
import {spawn} from 'child_process'

var streamProgram = (prog, args) => {
  args = args || []
  return (value) => {
    var instance = spawn(prog, args)

    var stream = Kefir.stream(emitter => {
      instance.stdout.on('data', data => {
        emitter.emit(data.toString())
      })
      instance.on('close', () => {
        emitter.end()
      })
    })

    instance.stderr.on('data', data => {
      console.error(data.toString())
    })

    instance.stdin.write('' + value)
    instance.stdin.end()

    return stream
  }
}

Kefir.sequentially(100, [1, 2, 3])
  .flatMap(streamProgram('node', [__dirname + '/../example/inc.js']))
  .log()
