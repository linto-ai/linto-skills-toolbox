var assert = require("assert")
const ParserNlu = new require('../lib/parser/nluParser')
const parser = new ParserNlu()

const appName = 'linto'
const filePath = process.cwd() + '/test/data/parser.md'

describe('parser nlu', () => {
  it('check if the data exist', async function () {
    await parser.process(appName, filePath)
      .then((dataParsed) => {
        assert.ok(dataParsed)
        assert.equal(dataParsed.applicationName, 'app:' + appName)
        assert.equal(dataParsed.sentences.length, 14)
        assert.ok(dataParsed.sentences[0].intent)
        assert.ok(dataParsed.sentences[0].entities)
        assert.ok(dataParsed.sentences[0].language)
        assert.ok(dataParsed.sentences[0].text)
        assert.ok(dataParsed.sentences[0].origin)
      })
  })

  it('check the parser first data based on data/parser.md', async function () {
    await parser.process(appName, filePath)
      .then((dataParsed) => {
        assert.equal(dataParsed.sentences[0].intent, 'app:testNameIntent')
        assert.equal(dataParsed.sentences[0].language, 'en')
        assert.equal(dataParsed.sentences[0].text, 'here is my first input acronyme1')
        assert.equal(dataParsed.sentences[0].origin, 'here is my first input [acronyme1](acronyme)')
      })
  })

  it('check the parser last data based on data/parser.md', async function () {
    await parser.process(appName, filePath)
      .then((dataParsed) => {
        let lastIndex = dataParsed.sentences.length -1

        assert.equal(dataParsed.sentences[lastIndex].intent, 'app:testNameIntent')
        assert.equal(dataParsed.sentences[lastIndex].language, 'fr')
        assert.equal(dataParsed.sentences[lastIndex].text, 'suivit du dernier acronymeEntitie2')
        assert.equal(dataParsed.sentences[lastIndex].origin, 'suivit du dernier [acronymeEntitie2](acronyme)')
      })
  })

  it('file not found', async function () {
    assert.throws(() => parser.process(appName, 'fake/path'))
    assert.throws(() => parser.process(appName, undefined))
    assert.throws(() => parser.process(undefined, filePath))
    assert.throws(() => parser.process(undefined, 'fake/path'))
  })
})