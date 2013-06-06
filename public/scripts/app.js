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

angular.module('sosPomocApp', ['ngResource'])

  .config(function($routeProvider) {
    $routeProvider
      .when('/needs/new', {
        controller: 'AdFormCtrl',
        templateUrl: 'views/new.html'
      })
      .when('/needs/:id/edit', {
        controller: 'AdFormCtrl',
        templateUrl: 'views/edit.html'
      })
      .when('/needs/:id', {})
      .when('/needs', {})
      .otherwise('/');
  })

  .factory('Ad', function($resource) {
    return $resource('/ads/:id', {id:'@id'}, {
      show: { method: 'GET', isArray: true },
      get: { method: 'GET'},
      create: { method: 'POST' },
      remove: { method: 'DELETE'},
      edit: { method: 'PUT'}
    });
  })

  .config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    return delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
