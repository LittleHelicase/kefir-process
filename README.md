# kefir-process

[![Build Status](https://travis-ci.org/LittleHelicase/kefir-process.svg?branch=master)](https://travis-ci.org/LittleHelicase/kefir-process)

Simply use programs in kefirs flatMap.

## Installation

Via npm

```
npm install kefir-process
```

## Usage

Create a processor and pass it to flatMap:

```js
import {createProcess} from 'kefir-process'

Kefir.sequentially(100, ['Kefir', 'Process', 'App'])
  .flatMap(createProcess('grep', ['Process']))
```
