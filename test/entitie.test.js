var assert = require("assert")
var utility = require('../utility')

const search_payload = {
  transcript: "créer moi un memo pour allez a vegas",
  confidence: "0.5",
  nlu: {
    intent: "memo",
    entitiesNumber: 2,
    entities: [{
      start: 0,
      end: 5,
      entity: "action_create",
      evaluated: false,
      subEntities: [],
      probability: 0.16410998496335738,
      mergeSupport: false,
      value: "créer"
    }, {
      start: 10,
      end: 36,
      entity: "expression",
      evaluated: false,
      subEntities: [],
      probability: 0.21005744098803678,
      mergeSupport: false,
      value: "un memo pour allez a vegas"
    }]
  }
}

describe('utility extractEntityFromPrefix', () => {
  it('it should extract the entitie action from prefix', function () {
    let prefixSearch = 'action'
    let entitie = utility.extractEntityFromPrefix(search_payload, prefixSearch)
    assert.ok(entitie.entity.includes(prefixSearch))
    assert.equal(entitie.entity, 'action_create')
  })

  it('it should extract the entitie action from fullName', function () {
    let entitieSearch = 'expression'
    let entitie = utility.extractEntityFromPrefix(search_payload, entitieSearch)
    assert.ok(entitie.entity.includes(entitieSearch))
    assert.equal(entitie.entity, 'expression')
  })

  it('it should not found an entitie', function () {
    let prefix = 'noEntitie'
    let entitie = utility.extractEntityFromPrefix(search_payload, prefix)
    assert.equal(entitie, undefined)
  })
})

describe('utility extractEntityFromType', () => {
  it('it should extract the entitie action from type', function () {
    let prefixSearch = 'action_create'
    let entitie = utility.extractEntityFromType(search_payload, prefixSearch)
    assert.equal(entitie.entity, 'action_create')
  })

  it('it should extract the entitie action from fullName', function () {
    let entitieSearch = 'expression'
    let entitie = utility.extractEntityFromType(search_payload, entitieSearch)
    assert.equal(entitie.entity, 'expression')
  })

  it('it should not found an entitie', function () {
    let prefix = 'action'
    let entitie = utility.extractEntityFromType(search_payload, prefix)
    assert.equal(entitie, undefined)
  })
})

describe('utility checkEntitiesRequire', () => {
  it('check if entitie array number match the payload', function () {
    assert.equal(utility.checkEntitiesRequire(search_payload, ['expression']), false)
  })

  it('check if both entitie is in payload', function () {
    assert.ok(utility.checkEntitiesRequire(search_payload, ['action_create', 'expression']))
  })
})