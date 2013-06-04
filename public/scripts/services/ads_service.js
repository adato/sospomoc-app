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

'use strict';

angular.module('sosPomocApp')
  .factory('adsService', function (Ad, $q, $timeout) {

    function refreshAds() {
      //XXX possible performance bottleneck, might need "modified
      // since"
      Ad.show(filter, function(data) {
        ads = data;
        deferredAds.resolve(ads);
        deferredAds = $q.defer();
      });

      scheduledRefresh = $timeout(refreshAds, 60000);
    }

    var ads = [];
    var deferredAds = $q.defer();
    var filter = {};
    var scheduledRefresh = $timeout(refreshAds, 1);

    return {
      setFilter: function(newFilter) {
        filter = newFilter;

        scheduledRefresh.cancel();
        refreshAds();
      },
      promiseAds: function() {
        return deferredAds.promise;
      },
      ads: function() {
        return ads;
      },
      categories: [
        {
          name: 'Úklid',
          value: 'cleaning'
        }, {
          name: 'Vysoušeče',
          value: 'dryers'
        }, {
          name: 'Oblečení',
          value: 'clothing'
        }, {
          name: 'Finanční pomoc',
          value: 'financial_aid'
        }, {
          name: 'Čisticí prostředky',
          value: 'detergents'
        }, {
          name: 'Potraviny',
          value: 'grocery'
        }, {
          name: 'Hygiena',
          value: 'hygiene',
        }, {
          name: 'Přístřeší',
          value: 'shelter'
        }, {
          name: 'Zázemí/hlídání dětí',
          value: 'facilities'
        }, {
          name: 'Nářadí',
          value: 'gear'
        }
      ]
    };
  });
