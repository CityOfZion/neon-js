import chai from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

global.setupMock = (data = null, passthrough = false) => {
  const mock = new MockAdapter(axios)
  if (data) {
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
  }
  if (passthrough) {
    mock.onAny().passThrough()
  }
  return mock
}
