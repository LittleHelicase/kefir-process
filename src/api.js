
import {spawn} from 'child_process'
import Kefir from 'kefir'

const maxParallel = 2
var running = 0

export function createProcess (program, args) {
  args = args || []
  return (value) => {
    var mayRun = Kefir.withInterval(1, emitter => {
      if (running < maxParallel) {
        running++
        var instance = spawn(program, args)
        emitter.emit(instance)
        emitter.end()
      } else {
      }
    })
    
    var readyCallback
    var readyStream = Kefir.fromCallback(callback => { readyCallback = callback })

    var stream = Kefir.stream(emitter => {
      mayRun.onValue(instance => {
        instance.stdout.on('data', data => {
          emitter.emit(data.toString())
        })
        instance.on('close', () => {
          emitter.end()
          running--
        })
        instance.stderr.on('data', data => {
          console.error(data.toString())
        })
        readyCallback(instance)
      })      
      readyStream.onValue(instance => {
          instance.stdin.write('' + value)
          instance.stdin.end()
        })
    })

    return stream
  }
}
