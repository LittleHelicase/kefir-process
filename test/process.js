
import test from 'ava'

import Kefir from 'kefir'
import {fromProgram} from '../src/api'

test.cb('called programm terminates', t => {
  t.plan(1)
  Kefir.sequentially(100, [])
    .flatMap(fromProgram('node', ['fixtures/inc.js']))
    .onEnd(() => { t.pass(); t.end() })
})

test.cb('called programm terminates', t => {
  t.plan(4)
  var wanted = Kefir.sequentially(0, [2, 3, 4])
  var result = Kefir.sequentially(10, [1, 2, 3])
    .flatMap(fromProgram('node', ['fixtures/inc.js']))
    .map(Number)
  Kefir.zip([wanted, result])
    .onValue(v => { t.same(v[0], v[1]) })
    .onEnd(() => { t.pass(); t.end() })
})
