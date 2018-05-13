import '@babel/polyfill'
import chai from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import fs from 'fs'
import logging, { logger } from '../src/logging'
const testlog = fs.createWriteStream('test.log')
const oldStderrWrite = process.stderr.write
function newStderrWrite () {
  oldStderrWrite.apply(process.stderr, arguments)
  testlog.write.apply(testlog, arguments)
}
process.stderr.write = newStderrWrite

const oldStdoutWrite = process.stdout.write
function newStdoutWrite () {
  oldStdoutWrite.apply(process.stdout, arguments)
  testlog.write.apply(testlog, arguments)
}
process.stdout.write = newStdoutWrite

var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const addCases = (mock, data) => {
  Object.keys(data).map((k) => {
    const c = data[k]
    let match = c.url
    if (c.regex) match = new RegExp(c.regex)
    if (c.body) {
      mock.onPost(match, c.body).reply(200, c.response)
    } else {
      mock.onGet(match).reply(200, c.response)
    }
  })
  return mock
}
global.setupMock = (data = null, passthrough = false) => {
  const mock = new MockAdapter(axios)
  if (data) {
    if (Array.isArray(data)) {
      for (const dataset of data) {
        addCases(mock, dataset)
      }
    } else {
      addCases(mock, data)
    }
  }
  if (passthrough) {
    mock.onAny().passThrough()
  }
  return mock
}

global.setupLogs = () => {
  logger.setAll('warn')
  logger.getLogger('test').setLevel('info')
  return logging('test')
}
