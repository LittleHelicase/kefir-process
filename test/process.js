
import test from 'ava'

import Kefir from 'kefir'
import {createProcess} from '../src/api'

test.cb('called programm terminates', t => {
  t.plan(1)
  Kefir.sequentially(100, [])
    .flatMap(createProcess('node', ['fixtures/inc.js']))
    .onEnd(() => { t.pass(); t.end() })
})

test.cb('called programm terminates', t => {
  var num = 400
  var count = 0
  t.plan(4 * num)
  var wanted = Kefir.sequentially(22, Array(num + 1).join('23').split('').map(Number))
  var result = Kefir.sequentially(17, Array(num + 1).join('12').split('').map(Number))
    .flatMapConcat(createProcess('node', ['fixtures/inc.js']))
    .map(Number)
    .onValue(v => { count++; t.same(v, (count % 2 === 1) ? 2 : 3) })
  Kefir.zip([wanted, result])
    .onValue(v => { t.same(v[0], v[1]) })
    .onEnd(() => { t.end() })
})

test.cb('call system program grep', t => {
  t.plan(2)
  Kefir.sequentially(10, ['Kefir', 'Process', 'App'])
    .flatMap(createProcess('grep', ['Process'])) // -Z no newline!
    .onValue(v => { console.log('value', v); t.same(v, 'Process\n') }) // unfortunately, grep adds a newline at the end
    .onEnd(() => { console.log('end!'); t.pass(); t.end() })
})
