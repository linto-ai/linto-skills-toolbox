var assert = require("assert")
var utility = require('../utility')

describe('utility loadLanguage', () => {
  let outputText = '_loaded'
  let pathTest = './test/data/'
  let skillsTest = 'test'

  before(function () {
    process.env.DEFAULT_LANGUAGE = 'fr-FR'
  })

  it('language loaded based on env default language', function () {
    let language = process.env.DEFAULT_LANGUAGE
    let loadedData = utility.loadLanguage(pathTest, skillsTest)
    assert.equal(loadedData, language + outputText)
  })

  it('language loaded based on param', function () {
    let language = 'en-US'
    let loadedData = utility.loadLanguage(pathTest, skillsTest, language)
    assert.equal(loadedData, language + outputText)
  })

  it('it throws when file don\'t exist', function () {
    let language = 'en-US'
    assert.throws(() => utility.loadLanguage(pathTest, 'error', language))
    assert.throws(() => utility.loadLanguage(pathTest, 'error'))
    assert.throws(() => utility.loadLanguage(pathTest, 'error', 'en-EN'))
  })

  it('it throws when param is wrong', function () {
    assert.throws(() => utility.loadLanguage(20, skillsTest))
    assert.throws(() => utility.loadLanguage(undefined, skillsTest))
    assert.throws(() => utility.loadLanguage(pathTest, 20))
    assert.throws(() => utility.loadLanguage(pathTest, {}))
  })
})