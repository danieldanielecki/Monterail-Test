(function() {
  'use strict';

  angular
    .module('app')
    .controller('MyLooksCtrl', MyLooksCtrl);

  MyLooksCtrl.$inject = ['$scope', '$modal', 'looksAPI', 'Auth'];

  function MyLooksCtrl($scope, $modal, looksAPI, Auth) {

    $scope.user = Auth.getCurrentUser();
    var userEmail = $scope.user.email;

    $scope.userLooks = [];
    $scope.editLook = {};

    var myModal = $modal({
      scope: $scope,
      show: false
    });

    $scope.showModal = function() {
      myModal.$promise.then(myModal.show);
    };

    looksAPI.getUserLooks(userEmail)
      .then(function(data) {
        console.log(data);
        $scope.userLooks = data.data;
      })
      .catch(function(err) {
        console.log('failed to get looks for user ' + err);
      });

    $scope.editLook = function(look) {
      looksAPI.getUpdateLook(look)
        .then(function(data) {
          console.log(data);
          $scope.editLook = data.data;
        })
        .catch(function(err) {
          console.log('failed to edit look ' + err);
        });
    };

    $scope.saveLook = function() {
      var look = $scope.editLook;

      looksAPI.updateLook(look)
        .then(function(data) {
          console.log('Look updated');
          console.log(data);
          $scope.editLook.title = '';
          $scope.editLook.description = '';
        })
        .catch(function(err) {
          console.log('failed to update' + err);
        });
    };

    $scope.delete = function(look) {
      var index = $scope.userLooks.indexOf(look);

      looksAPI.deleteLook(look)
        .then(function(data) {
          console.log('success, look deleted');
          $scope.userLooks.splice(index, 1);
        })
        .catch(function(err) {
          console.log('failed to delete look' + err);
        });
    }

  }
})();