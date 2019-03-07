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

const debug = require('debug')('utility:parser:lm:linstt')
const fs = require('fs'),
  readline = require('readline')

const REGEX_WORD = new RegExp('\\[(.*?)\\]')
const REGEX_ENTITY = new RegExp('\\((.*?)\\)')

const SEPARATOR = '##'
const INTENT_SEPARATOR = '##intent'
const ENTITIE_SEPARATOR = '##entitie'

const SUPPORTED_LANGUE = ['fr']

class LmParser {
  constructor() {
    return this
  }

  process(pathFile) {
    let output = {
      intent: {},
      entities: {}
    }

    let isIntent = false,
      key, language
    return new Promise((resolve, reject) => {
      readline.createInterface({
        input: fs.createReadStream(pathFile)
      }).on('line', function (line) {
        if (line.indexOf(SEPARATOR) > -1) {
          key = line.split(':')[1]
          language = line.split(':')[2]
          if (line.indexOf(INTENT_SEPARATOR) > -1) {
            isIntent = true
            if (output.intent[key] === undefined && SUPPORTED_LANGUE.includes(language))
              output.intent[key] = []
          } else if (line.indexOf(ENTITIE_SEPARATOR) > -1) {
            isIntent = false
            if (output.entities[key] === undefined && SUPPORTED_LANGUE.includes(language))
              output.entities[key] = []
          }
        } else if (line.length !== 0 && SUPPORTED_LANGUE.includes(language)) {
          if (isIntent) {
            output = manageIntent(line, output, key)
          } else {
            output = manageEntitie(line, output, key)
          }
        }
      }).on('close', () => {
        debug(output)
        debug('close')
        resolve(output)
      })
    });
  }
}

// Add entitie if no duplicate
let manageEntitie = function (line, output, entitieKey) {
  line = line.replace('- ', '')
  if (!output.entities[entitieKey].includes(line))
    output.entities[entitieKey].push(line)
  return output
}

let manageIntent = function (line, output, intentKey) {
  line = line.replace('- ', '')
  let text = line
  for (let i = 0; i < (line.split("](").length - 1); i++) {
    let word = text.match(REGEX_WORD)
    let entity = text.match(REGEX_ENTITY)
    text = text.replace(word[0] + entity[0], '#' + entity[1])

    // Create key entitie if don't exist
    if (output.entities[entity[1]] === undefined)
      output.entities[entity[1]] = []
    // Add entitie if no duplicate
    if (!output.entities[entity[1]].includes(word[1]))
      output.entities[entity[1]].push(word[1])
  }

  // Add command to intent if no duplicate
  if (!output.intent[intentKey].includes(text))
    output.intent[intentKey].push(text)
  return output
}

module.exports = LmParser