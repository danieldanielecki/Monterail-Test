(function() {
    'use strict';

    angular
        .module("app")
        .controller("ProfileCtrl", ProfileCtrl);

    ProfileCtrl.$inject = ["$scope", "Auth"];

    function ProfileCtrl($scope, Auth) {
    $scope.user = Auth.getCurrentUser();
    $scope.profileInfo = {};
    var id = $scope.user._id;
    }
}());
