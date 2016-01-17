
var toKefir = require('kefir-node-stream')

toKefir(process.stdin)
  .map(function (buf) { return buf.toString() })
  .map(Number)
  .map(function (n) { return n + 1 })
  .onValue(function (n) { console.log(n) })
