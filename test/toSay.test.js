var assert = require("assert")
var utility = require('../utility')

describe('utility formatToSay', () => {
  it('it ok when require param is string', function () {
    let text = 'my text'
    let payload = utility.formatToSay(text)
    assert.equal(typeof payload, 'object')
    assert.equal(typeof payload.behavior, 'string')
    assert.equal(payload.behavior, text)
  })

  it('it throws when require param is not string', function () {
    assert.throws(() => utility.formatToSay())
    assert.throws(() => utility.formatToSay(20))
    assert.throws(() => utility.formatToSay({}))
    assert.throws(() => utility.formatToSay(undefined))
  })
})

describe('utility formatToAsk', () => {
  it('it ok when require param is given', function () {
    let text = 'my text'
    let data = {}
    let payload = utility.formatToAsk(text, data)
    assert.equal(typeof payload, 'object')
    assert.equal(typeof payload.ask, 'string')

    assert.equal(payload.ask, text)
    assert.equal(payload.conversationData, data)
  })

  it('it throws when format parameter is not ok', function () {
    assert.throws(() => utility.formatToAsk())
    assert.throws(() => utility.formatToAsk('text'))
    assert.throws(() => utility.formatToAsk(undefined,{}))
    assert.throws(() => utility.formatToAsk(20, {}))
  })
})