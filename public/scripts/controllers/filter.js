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
  .controller('FilterCtrl', function ($scope, adsService) {

    function checkedCategories() {
      return $scope.categories
        .filter(function(category) {
          return category.checked;
        })
        .map(function(category) {
          return category.value;
        });
    }

    $scope.categories = adsService.categories.map(function(category) {
      category.checked = true;
      return category;
    });

    $scope.toggle = function (category, $event) {
      category.checked = !category.checked;
      $event.preventDefault();

      adsService.setFilter({ categories: checkedCategories() });
    };

  });
