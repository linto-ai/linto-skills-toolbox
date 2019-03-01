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

const PREFIX = "app:"
const INTENT_SEPARATOR = '##'

class NluParser {
  constructor() {
    return this
  }

  process(applicatioName, pathFile) {
    let intent
    let language
    let output = {
      applicationName: PREFIX + applicatioName,
      sentences: []
    }
    return new Promise((resolve, reject) => {
      readline.createInterface({
        input: fs.createReadStream(pathFile)
      }).on('line', function (line) {
        if (line.indexOf(INTENT_SEPARATOR) > -1) {
          intent = PREFIX + line.split(':')[1]
          language = line.split(':')[2]
        } else if (line.length !== 0) {

          line = line.replace('- ', '')
          let mySentence = {
            intent: intent,
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
          output.sentences.push(mySentence)
        }
      }).on('close', () => {
        resolve(output)
      })
    });
  }
}

module.exports = NluParser