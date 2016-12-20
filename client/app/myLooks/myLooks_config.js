(function () {
    'use strict';

    angular
        .module("app")
        .config(config);

    config.$inject = ["$stateProvider"];

    function config($stateProvider) {
        $stateProvider
            .state("mylooks", {
                url: "/mylooks",
                templateUrl: "app/mylooks/myLooks.html", // File myLoooks.html for this will be us
                controller: "MyLooksCtrl", // Defining controller.
                authenticate: true // Authenticated require to access this route.
            });
    }
})();
