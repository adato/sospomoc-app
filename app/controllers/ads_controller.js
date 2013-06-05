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

AdsController.index = function() {
  var self = this;
  Ad.find(function(err, ads) {
    self.res.json(ads.map(function (ad) {
      var jsonAd = ad.toObject();
      delete jsonAd.token;

      return jsonAd;
    }));
  });
}

AdsController.create = function() {
    var req = this.req
    var res = this.res
    item = new Ad(req.body);
    console.log('saving')
    return item.save(function(err) {
        if (err) {
            res.send({
                errors: err
            });
        }
        if (!err) {
            return res.send(item);
        }
    });
}

AdsController.update = function() {
    var self = this;
    self.res.send(501)
}

AdsController.delete = function() {
    var self = this;
    self.res.send(501)
}


module.exports = AdsController;
