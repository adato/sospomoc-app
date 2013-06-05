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
  .controller('AdCreationCtrl', function ($scope, Ad, adsService) {

   $scope.findMe = function() {
        if ($scope.geolocationAvailable) {
            return navigator.geolocation.getCurrentPosition(function(position) {
                return $scope.$apply(function() {
                    return $scope.newItem.location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                });
            }, function() {});
        }
    };

    $scope.initAutocomplete = function() {
        var autocomplete, input;
        input = document.getElementById('newLocation');
        autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addDomListener(input, 'keydown', function(e) {
            if (e.keyCode === 13) {
                return e.preventDefault();
            }
        });
        return google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place;
            place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            if (place.geometry.location) {
                return $scope.$apply(function() {
                    return $scope.newItem.location = {
                        lat: place.geometry.location.jb,
                        lon: place.geometry.location.kb,
                        name: document.getElementById('newLocation').value
                    };
                });
            }
        });
    };

    $scope.init = function() {
        $scope.errors = []
        $scope.formSent = false
        $scope.newItem = {}
        $scope.asked = false
        $scope.showForm = false
        $scope.categories = adsService.categories.map(function(category) {
            category.checked = false;
            return category;
        });
        $scope.initAutocomplete()
    }

    $scope.$watch('showForm', function() {
        $scope.toggleTitle = $scope.showForm ? 'skrýt' : 'zadat potřebu';
        if($scope.showForm && !$scope.newItem.location) {
            $scope.geolocationAvailable = navigator.geolocation ? true : false
            $scope.asked = true
            $scope.findMe()
        }
    });

    $scope.submit = function() {
        console.log($scope.newItem)
        if(!$scope.createForm.$invalid) {
            $scope.errors = []
            if(!$scope.newItem.location) {
                $scope.errors.push({param: 'location', msg: "Lokalita je povinná položka."});
            }
            else {
                Ad.create($scope.newItem, (function(data){
                    if(data.errors) {
                        $scope.errors.push("Odeslání se nezdařilo")
                    }
                    else {
                        $scope.errors = [];
                        $scope.formSent = true;
                        $scope.newItem = {}
                    }

                }))
            }
        }
    }

    $scope.init();

  });
