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
  .controller('AdFormCtrl', function ($scope, Ad, adsService, $http, $routeParams, $location) {

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
      if(input)  {
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
      }
    };

    var loadAd = function(id) {
        Ad.get({'id':id}, (function(data) {
            if(data.errors) {
                $location.path('/')
            } else {
                angular.forEach(data.categories, function(v, k) {
                data.categories[k].checked = true
                })
                $scope.newItem = data
                $scope.newItem.categories = $.extend($scope.allCategories, $scope.newItem.categories)
                $scope.newItem.location.name = $scope.newItem.location.place
                delete $scope.newItem.location.place
            }
        }))
    }

    $scope.remove = function() {
        Ad.remove({'id': $routeParams.id}, function(data) {
            if(data.ok) {
                $location.path('/')
            } else {
                $scope.errors.push('Smazání se nezdařilo')
            }
        })
    }

    $scope.init = function() {
      $scope.errors = []
      $scope.formSent = false
      $scope.newItem = {}
      $scope.asked = false
      $scope.isTouchDevice = $('html').hasClass('touch')
      $scope.geolocationAvailable = false //default
      $scope.editMode = false
      $scope.allCategories = adsService.categories().map(function(category) {
        category.checked = false;
        return category;
      });
      if($routeParams.id) {
          loadAd($routeParams.id)
          $scope.editMode = true
      } else {
          $scope.newItem.categories = angular.copy($scope.allCategories);
          if(!$scope.newItem.location && $scope.isTouchDevice) {
              $scope.geolocationAvailable = navigator.geolocation ? true : false
              $scope.asked = true
              $scope.findMe()
          }
      }
      $scope.initAutocomplete();
    }

    var createAd = function(categoriesBackup) {
        if($scope.editMode) {
            $scope.newItem.token = $routeParams.id
            Ad.edit({'id': $routeParams.id}, $scope.newItem, function(data) {
                $scope.newItem.categories = categoriesBackup
                if(data.errors) {
                    $scope.errors.push("Odeslání se nezdařilo")
                }
                else {
                    $scope.errors = [];
                    $scope.formSent = true;
                }
            })
        } else {
            Ad.create($scope.newItem, (function(data){
                if(data.errors) {
                    $scope.errors.push("Odeslání se nezdařilo")
                    $scope.newItem.categories = categoriesBackup
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
    
    var filterCategories = function() {
        return $scope.newItem.categories.filter(function (el, idx, arr) { return el.checked == true; })
    }
    
    var validate = function() {
        $scope.errors = []        
        var filtered = filterCategories()   
        if(!filtered.length) {
          $scope.errors.push("Vyberte alespoň jednu kategorii.")
        }
        if(!$scope.newItem.location) {
          $scope.errors.push("Lokalita je povinná položka.")
        }        
    }

    $scope.submit = function() {
      $scope.formSent = false
      if(!$scope.createForm.$invalid) {
        validate()
        if(!$scope.errors.length) {
          var categoriesBackup = angular.copy($scope.newItem.categories)   
          $scope.newItem.categories = filterCategories()
          if($scope.newItem.location.name) {
              $scope.newItem.location.place = $scope.newItem.location.name
              createAd(categoriesBackup)
          }
          else {
              var location = $scope.newItem.location
              var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+ location.lat + ',' + location.lon + '&sensor=true'
              $http.get(url).success(function(data) {
                  if(data.results.length > 0)   $scope.newItem.location.place = data.results[0].formatted_address
                  createAd(categoriesBackup)
              })
          }
        }
      }
    }

    $scope.toggleCategory = function(category) {
      category.checked = !category.checked;
    }


  });
