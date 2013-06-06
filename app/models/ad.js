/*
 This file is part of SOS Pomoc application.

 SOS Pomoc application is free software: you can redistribute it and/or
 modify it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 SOS Pomoc application is distributed in the hope that it will be
 useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public
 License along with SOS Pomoc application.  If not, see
 <http://www.gnu.org/licenses/>.
 */

var validate = require('mongoose-validator').validate;

var schema = require('mongoose').Schema({
    name: {type: String, required: true},
    email: {type: String, validate: validate('isEmail')},
    categories: {type: Array/*, required: true*/},
    description: String,
    location: {
        place: {type: String/*, required: true */},
        lon: {type: Number, required: true },
        lat: {type: Number, required: true }
    },
    token: {type: String, required: true },
    isDeleted: {type: Boolean, 'default': false}
});

module.exports = require('mongoose').model('Ad', schema);
