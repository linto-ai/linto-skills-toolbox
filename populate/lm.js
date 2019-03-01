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

const request = require('request')
const fs = require('fs')

class PopulateLm {
  constructor() {}

  inject(host, applicationName, filePath) {
    this.host

  }

  getRequest(method, url, filePath) {
    var options = {
      method,
      url,
      headers: {}
    };

    if (filePath !== undefined)
      options.formData = {
        data: fs.createReadStream(filePath)
      }

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
  }
}

module.exports = PopulateLm