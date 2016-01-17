
import {spawn} from 'child_process'
import Kefir from 'kefir'

export function fromProgram (program, args) {
  args = args || []
  return (value) => {
    var instance = spawn(program, args)

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
