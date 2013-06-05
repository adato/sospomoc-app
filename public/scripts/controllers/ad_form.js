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
  .controller('AdFormCtrl', function ($scope, Ad, adsService) {

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
        $scope.allCategories = adsService.categories.map(function(category) {
            category.checked = false;
            return category;
        });
        $scope.newItem.categories = angular.copy($scope.allCategories);
        $scope.initAutocomplete()
    }

    $scope.$watch('showForm', function() {
        if($scope.showForm && !$scope.newItem.location) {
            $scope.geolocationAvailable = navigator.geolocation ? true : false
            $scope.asked = true
            $scope.findMe()
        }
    });

    $scope.submit = function() {
        if(!$scope.createForm.$invalid) {
            $scope.errors = []
            if(!$scope.newItem.location) {
                $scope.errors.push({param: 'location', msg: "Lokalita je povinná položka."});
            }
            else {
                $scope.newItem.categories = $scope.newItem.categories.filter(function (el, idx, arr) { return el.checked == true; })
                Ad.create($scope.newItem, (function(data){
                    if(data.errors) {
                        $scope.errors.push("Odeslání se nezdařilo")
                    }
                    else {
                        $scope.errors = [];
                        $scope.formSent = true;
                        $scope.newItem = {}
                        $scope.newItem.categories = $scope.allCategories
                    }
                }))
            }
        }
    }

    $scope.toggleCategory = function(index) {
        $scope.newItem.categories[index].checked = !$scope.newItem.categories[index].checked
    }

    $scope.open = function() {
      $scope.showForm = true;
    };

    $scope.close = function() {
      $scope.showForm = false;
    };

    $scope.init();

  });