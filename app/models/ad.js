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
var mongoose = require('mongoose');


var schema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, validate: validate('isEmail')},
    categories: [{type: String, required: true }],
    description: String,
    location: {
        place: {type: String/*, required: true */},
        lon: {type: Number, required: true },
        lat: {type: Number, required: true }
    },
    token: {type: String, required: true },
    isDeleted: {type: Boolean, 'default': false},
    createdAt: {type: Date, 'default': Date.now()},
    updatedAt: {type: Date},
    contact: {type: String}
});

//array: { type: [Number], unique: true, required: true } should work as well
schema.path('categories').validate(function (value) {
  if(value instanceof Array && value.length>0) return true
  else return false;
}, 'NO_CATEGORIES');

module.exports = require('mongoose').model('Ad', schema);
