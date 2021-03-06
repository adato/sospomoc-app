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
var emails = require('../lib/emails');

AdsController.index = function () {
  var self = this;
  var searchObject = { location: { $exists: true} }
  if (self.req.query.categories) {
    searchObject.categories = { $in: self.req.query.categories.split(',') };
  }

  Ad.find({isDeleted: {'$ne': true}}).select('-token').exec(function (err, ads) {
    self.res.json(ads.map(function (ad) {
      return ad.toObject();
    }));
  });
}

AdsController.create = function () {
  var req = this.req
  var res = this.res
  var item = new Ad(req.body);
  var self = this;
  console.log('saving')
  // create fake token to trick validation :)


  var item = new Ad(req.body);
  item.token = uuid.v4();
  return item.save(function (err, item) {
    if (err) {
      res.send({
        errors: err
      });
    }
    else {
      // send info email
      emails.adNewEmail(item.toObject()).then(function (mail) {
        //console.log(mail.html);
        console.log("Sending NewAd email to:" + mail.to);
        self.app.mailer.sendMail(mail, function (err, responseStatus) {
          if (err) {
            console.log('Error sending NewAd email to: ' + mail.to + ' (' + error + ')');
            res.send(err)
          }
          else {
            var object = item.toObject();
            console.log(object);
            delete object.token;
            return res.send(object);
          }
        });

      }, function (err) {
        console.log('Error generating email: ' + error);
        res.send(err)
      });
    }
  });


}

AdsController.show = function () {
  var req = this.req
  var res = this.res
  Ad.findOne({token: req.params.id, isDeleted: {'$ne': true}}).exec(function (err, ad) {
    if (ad) {
      return res.send(ad)
    } else {
      res.send({errors: 'ERR_AD_NOT_FOUND'})
    }
  })
}

AdsController.update = function () {
  var req = this.req
  var res = this.res
  Ad.findOne({token: req.params.id}).exec(function (err, oldAd) {
    if (oldAd) {
      var newAd = new Ad({
        location: req.body.location,
        description: req.body.description,
        categories: req.body.categories,
        email: req.body.email,
        name: req.body.name,
        updatedAt: Date.now()
      })
      var newData = newAd.toObject()
      delete newData._id
      return Ad.update({_id: oldAd._id}, newData, {upsert: true}, function (err, item) {
        if (err) {
          res.send({
            errors: err
          });
        }
        else {
          return res.send(newAd);
        }
      });
    } else {
      res.send({errors: 'ERR_AD_NOT_FOUND'})
    }
  })
}

AdsController.destroy = function () {
  var req = this.req
  var res = this.res
  return Ad.findOne({
    token: req.params.id
  }, function (err, ad) {
    if (ad) {
      ad.isDeleted = true;
      return ad.save(function (err) {
        if (err) {
          return res.send({
            ok: false,
            errors: err
          });
        } else {
          return res.send({
            ok: true
          });
        }
      });
    } else {
      err = err != null ? err : {
        err: 'ERR_AD_NOT_FOUND'
      };
      return res.send({
        ok: false,
        errors: err
      });
    }
  });
}


module.exports = AdsController;
