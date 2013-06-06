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

var AdsController = new (require('locomotive').Controller)();
var Ad = require('../models/ad');
var uuid = require('node-uuid');

AdsController.index = function () {
    var self = this;
    var searchObject = { location: { $exists: true} }
    if (self.req.query.categories) {
        searchObject.categories = { $in: self.req.query.categories.split(',') };
    }

    Ad.find({}).select('-token').exec(function (err, ads) {
        self.res.json(ads.map(function (ad) {
            return ad.toObject();
        }));
    });
}

AdsController.create = function () {
    var req = this.req
    var res = this.res
    var item = new Ad(req.body);
    console.log('saving')
    // create fake token to trick validation :)
    item.token = uuid.v4();
    return item.save(function (err, item) {
        if (err) {
            res.send({
                errors: err
            });
        }
        else {
            // send info email
            
            var object = item.toObject();
            delete object.token;
            return res.send(object);
        }
    });
}

AdsController.show = function () {
    var req = this.req
    var res = this.res
    Ad.findOne({'token': req.params.id}).exec(function (err, ad) {
        if(ad) {
          return res.send(ad)
        } else {
            res.send(404)
        }
    })
}

AdsController.update = function () {
    var self = this;
    self.res.send(501)
}

AdsController.del = function () {
    var self = this;
    self.res.send(501)
}


module.exports = AdsController;
