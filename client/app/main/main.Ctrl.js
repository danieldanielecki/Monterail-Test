(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', 'Auth', '$modal', 'looksAPI', 'Upload'];

  function MainCtrl($scope, Auth, $modal, looksAPI, Upload) {
    $scope.user = Auth.getCurrentUser();

    $scope.look = {};
    $scope.looks = [];
    $scope.scrapePostForm = true;
    $scope.showScrapeDetails = false;
    $scope.gotScrapeResults = false;
    $scope.loading = false;

    $scope.picPreview = true;
    $scope.uploadLookTitle = true;
    $scope.uploadLookForm = false;

    $scope.busy = true;
    $scope.allData = [];

    var myModal = $modal({
      scope: $scope,
      show: false
    });

    var page = 0;
    var step = 3;

    $scope.showModal = function () {
      myModal.$promise.then(myModal.show);
    };

    looksAPI.getAllLooks()
      .then(function (data) {
        console.log(data);
        $scope.allData = data.data;
        $scope.nextPage();
        $scope.busy = false;
      })
      .catch(function (err) {
        console.log("Failed to log get looks " + err);
      });

    $scope.showUploadForm = function () {
      $scope.uploadLookForm = true;
      $scope.scrapePostForm = false;
      $scope.uploadLookTitle = false;
    };

    $scope.nextPage = function () {
      var lookLength = $scope.looks.length;

      if ($scope.busy) {
        return;
      }
      $scope.busy = true;
      $scope.looks = $scope.looks.concat($scope.allData.splice(page * step, step)); // concact - join 2 arrays, splice - add items to array.
      page++;
      $scope.busy = false;
      if ($scope.looks.length === 0) {
        $scope.noMoreData = true;
      }
    };

    $scope.addVote = function (look) {
      looksAPI.upVoteLook(look)
        .then(function (data) {
          console.log(data);
          look.upVotes++;
        })
        .catch(function (err) {
          console.log("Failed adding upvote ");
        });
    };

    $scope.downVote = function (look) {
      looksAPI.downVoteLook(look)
        .then(function (data) {
          console.log(data);
          look.downVotes++;
        })
        .catch(function (err) {
          console.log("Failed adding downvote ");
        });
    };

    $scope.addScrapePost = function () {
      var look = {
        description: $scope.look.description,
        title: $scope.look.title,
        email: $scope.user.email,
        name: $scope.user.name,
        _creator: $scope.user._id
      };

      looksAPI.createScrapeLook(look)
        .then(function (data) {
          // alertSuccess.show();
          $scope.showScrapeDetails = false;
          $scope.gotScrapeResults = false;
          $scope.look.title = "";
          $scope.look.link = "";
          $scope.looks.splice(0, 0, data.data);

          console.log(data);
        })
        .catch(function () {
          alertFail.show();

          console.log('Failed to post.');

          $scope.showScrapeDetails = false;
        });
    };

    $scope.uploadPic = function () {
      Upload.upload({
        url: 'api/look/upload',
        data: {
          title: $scope.look.title,
          description: $scope.look.description,
          email: $scope.user.email,
          name: $scope.user.name,
          _creator: $scope.user._id
        }
      }).then(function (resp) {
        console.log('Successful upload.');
        $scope.looks.splice(0, 0, resp.data); // Pushing the successful object into our view.
        $scope.look.title = "";
        $scope.look.description = "";
        $scope.picFile = "";
        $scope.picPreview = false;
      }, function (resp) { // This happens on fail.
        console.log(resp);
      }, function (evt) {
        console.log(evt);
      });
    };
  }
})();
