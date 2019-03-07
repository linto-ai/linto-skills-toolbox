/*
 * Copyright (c) 2017 Linagora.
 *
 * This file is part of Business-Logic-Server
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const debug = require('debug')('parser:rasa:to:tock')
const fs = require('fs'),
  readline = require('readline')

const REGEX_WORD = new RegExp('\\[(.*?)\\]')
const REGEX_ENTITY = new RegExp('\\((.*?)\\)')
const DEFAULT_LANGUAGE = 'fr'

const PREFIX = "app:"
const INTENT_SEPARATOR = '##intent'
const ENTITIE_SEPARATOR = '##entitie'

class NluParser {
  constructor() {
    return this
  }

  process(applicatioName, pathFile) {
    let intent, language, entitieKey, isIntent = false,
      isEntitie = false
    let output = {
      applicationName: PREFIX + applicatioName,
      sentences: []
    }
    let entities = {}

    return new Promise((resolve, reject) => {
      readline.createInterface({
        input: fs.createReadStream(pathFile)
      }).on('line', function (line) {
        if (line.indexOf(INTENT_SEPARATOR) > -1) {
          intent = PREFIX + line.split(':')[1]
          language = line.split(':')[2]
          isIntent = true
          isEntitie = false
        } else if (line.indexOf(ENTITIE_SEPARATOR) > -1) {
          entitieKey = line.split(':')[1]
          language = line.split(':')[2]
          isEntitie = true
          isIntent = false
        } else if (line.length !== 0) {
          if (isIntent) {
            let mySentence = manageIntent(line, intent, language)
            output.sentences.push(mySentence)
          } else if (isEntitie) {
            entities = manageEntitie(line, entitieKey, entities, language)
          }
        }
      }).on('close', () => {
        output = mergeData(output, entities)
        resolve(output)
      })
    });
  }
}

let mergeData = function (inputSentences, entitiesList) {
  if (Object.keys(entitiesList).length === 0)
    return inputSentences

  let output = inputSentences
  inputSentences.sentences.forEach(function (sentence) {
    var keysList = Object.keys(entitiesList[sentence.language]);
    sentence.entities.forEach(function (sentenceEntitie) {
      if (keysList.includes(sentenceEntitie.role)) {
        entitiesList[sentence.language][sentenceEntitie.role].forEach(function (entitieValue) {
          var mdMatchRegex = new RegExp("\\[([^\\]]+)]\\((" + sentenceEntitie.role + ")(\\))");
          let newValue = '[' + entitieValue + '](' + sentenceEntitie.role + ')'
          let newLine = sentence.origin.replace(mdMatchRegex, newValue)

          let mySentence = manageIntent(newLine, sentence.intent, sentence.language)
          output.sentences.push(mySentence)
        })
      }
    })
  });

  return output
}

let manageEntitie = function (line, entitieKey, entities, language = DEFAULT_LANGUAGE) {
  line = line.replace('- ', '')
  if (entities[language] === undefined) {
    entities[language] = {}
  }
  if (entities[language][entitieKey] === undefined)
    entities[language][entitieKey] = []
  entities[language][entitieKey].push(line)

  return entities
}

let manageIntent = function (line, intent, language = DEFAULT_LANGUAGE) {
  line = line.replace('- ', '')
  let mySentence = {
    intent,
    entities: [],
    language
  }

  let text = line
  for (let i = 0; i < (line.split("](").length - 1); i++) {
    let word = text.match(REGEX_WORD)
    let entity = text.match(REGEX_ENTITY)
    mySentence.entities.push({
      "entity": PREFIX + entity[1],
      "role": entity[1],
      "subEntities": [],
      "start": word.index,
      "end": word.index + word[1].length
    })

    text = text.replace(word[0] + entity[0], word[1])
  }
  mySentence.text = text
  mySentence.origin = line
  return mySentence
}

module.exports = NluParser