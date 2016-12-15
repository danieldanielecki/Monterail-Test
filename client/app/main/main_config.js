(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = ['$stateProvider'];

  function config($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/', // Default route.
        templateUrl: 'app/main/main.html', // HTML file that is used to display.
        controller: 'MainCtrl', // Name of controller.
        authenticate: true // Only authenticated users after login can access this route.
      });
  }

})();
