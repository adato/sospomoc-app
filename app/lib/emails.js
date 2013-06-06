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

var emailTemplates = require('email-templates');
var templatesDir = __dirname + '/../templates';
var Q = require('q');


module.exports.adNewEmail = function (email, item) {
    var deferred = Q.defer();
    emailTemplates(templatesDir, function (err, template) {
        console.log('Generating Ad creating email with this params');
        if (err) deferred.reject(err); //maybe there should be new Error(error)

        template('adNewEmail', item, function (err, html, text) {
            if (err) deferred.reject(err);
            else {
                console.log(html);
                deferred.resolve(html);
            }
        });
    });
    return deferred.promise;
}
/*if err
 callback({send: false, msg: err})
 else
 locals = {name: username, url: 'http://stream.lc:3000/#/confirmEmail?hash=' + hash }
 template "registration", locals, (err, html, text) ->
 if err
 callback({send: false, msg: err})
 else
 mailOptions = {
 from: 'support@adato.cz',
 to: email,
 subject: "HEARTH - e-mail confirmation",
 text: text
 html: html
 }
 status = transport.sendMail(mailOptions, (err, responseStatus) ->
 if err
 callback({send: false, msg: err})
 else
 callback({send: true})
 )
 */

