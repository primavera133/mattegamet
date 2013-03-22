'use strict';


// Declare app level module which depends on filters, and services
angular.module('matteApp', ['matteApp.filters', 'matteApp.services', 'matteApp.directives', 'ngSanitize']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/game1.html', controller: MatteCtrl});
    //$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
