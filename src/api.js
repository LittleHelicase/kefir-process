
import {spawn} from 'child_process'
import Kefir from 'kefir'

const maxParallel = 4

function fromMultiCallback(callbackConsumer) {
  return Kefir.stream(emitter => {
    callbackConsumer(x => {
      if(x == null) { 
        emitter.end()
        return
      }
      emitter.emit(x)
    })
  })
}

export function createProcess (program, args) {
  args = args || []
  var nextCallback
  var canRun = Kefir.merge(
    [
      Kefir.sequentially(0,  Array(maxParallel + 1).join('a').split('')),
      fromMultiCallback(callback => { nextCallback = callback })
    ])
  var inputStream = Kefir.never()
    // start maxParallel 
  return (value) => {
    inputStream = Kefir.concat([inputStream, Kefir.later(1, value)])
    var canThisRun = canRun.take(1)
    var mayRun = Kefir.zip([inputStream, canThisRun])
      .map(() => {
        var instance = spawn(program, args)
        return instance
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
          nextCallback(true)
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
