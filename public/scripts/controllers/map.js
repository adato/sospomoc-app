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
  .controller('MapCtrl', function ($scope, adsService) {

    function getInfoBoxOptions(ad) {
      var categories = adsService.categories
        .filter(function(category) {
          return ad.categories &&
            (ad.categories.indexOf(category.value) >= 0);
        })
        .map(function(category) {
          return category.name;
        });

      return {
        content: '' +
          '<div class="description">' +
            '<p>' + ad.description + '</p>' +
            '<p><strong>Kategorie:</strong> ' + categories.join(', ') + '</p>' +
          '</div>' +
          '<div class="contact">' +
            '<p><strong>Autor:</strong></p>' +
            '<p><a href="mailto:' + ad.email + '">' + ad.name + '</a></p>' +
            '<p>' + ad.contact + '</p>' +
          '</div>',
        pane: 'floatPane',
        closeBoxMargin: '-17px',
        pixelOffset: new google.maps.Size(-150, 0),
        boxStyle: {
          width: '300px',
          minHeight: '200px'
        }
      };
    }

    function createMarker(ad) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(ad.location.lat, ad.location.lng),
        map: $scope.map,
        icon: '/images/marker.png'
      });
      var infoBox = new InfoBox(getInfoBoxOptions(ad));

      google.maps.event.addListener(marker, 'click', function() {
        infoBox.open($scope.map, marker);
      });

      $scope.markers[ad['_id']] = marker;
      $scope.infoBoxes[ad['_id']] = infoBox;
    }

    function updateMarker(ad) {
      $scope.markers[ad['_id']].setPosition(
        new google.maps.LatLng(ad.location.lat, ad.location.lng)
      );
      $scope.infoBoxes[ad['_id']].setContent(
        getInfoBoxOptions(ad).content
      );
    }

    function deleteMarker(ad) {
      google.maps.event.clearListeners($scope.markers[ad['_id']], 'click');
      $scope.markers[ad['_id']].setMap(null);
      delete $scope.markers[ad['_id']];
      delete $scope.infoBoxes[ad['_id']];
    }

    function onAdsResolve(ads) {
      ads
        .filter(function(ad) {
          return $scope.markers[ad['_id']];
        })
        .forEach(updateMarker);

      ads
        .filter(function(ad) {
          return !$scope.markers[ad['_id']];
        })
        .forEach(createMarker);

      var adIds = ads.map(function(ad) {
        return ad['_id'];
      });
      var markerId;
      for (markerId in $scope.markers) {
        if ($scope.markers.hasOwnProperty(markerId) &&
            (adIds.indexOf(markerId) < 0)) {
          deleteMarker({ '_id': markerId });
        }
      }

      adsService.promiseAds().then(onAdsResolve);
    }
    adsService.promiseAds().then(onAdsResolve);

    $scope.map = null;
    $scope.markers = {};
    $scope.infoBoxes = {};

    $scope.initMap = function() {
      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(50.0632464, 14.4097413),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        styles: [
          {
            stylers: [
              { color: '#faf1c2' }
            ]
          }, {
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#fffae6' }
            ]
          }, {
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#332d10' }
            ]
          }, {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#f3e6a8' },
              { lightness: -37 },
              { saturation: -47 },
              { gamma: 1.82 }
            ]
          }, {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
              { color: '#fff9df' }
            ]
          }, {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#f4d387' },
              { saturation: 7 },
              { lightness: 39 }
            ]
          }, {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#e0d387' },
              { lightness: -9 }
            ]
          }, {
            featureType: 'transit',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#ccbe9a' }
            ]
          }, {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
              { color: '#cce6e0' }
            ]
          }, {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
              { color: '#daecc2' }
            ]
          }, {
            featureType: 'poi.attraction',
            elementType: 'geometry',
            stylers: [
              { color: '#d9c99a' }
            ]
          }, {
            featureType: 'poi.business',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#f0e9cf' }
            ]
          }, {
            featureType: 'poi.government',
            stylers: [
              { color: '#f0e7c1' }
            ]
          }, {
            featureType: 'poi.place_of_worship',
            stylers: [
              { color: '#ede4b4' }
            ]
          }, {
            featureType: 'landscape.natural.terrain',
            stylers: [
              { color: '#d9e9ba' }
            ]
          }
        ]
      });
    };

  });
