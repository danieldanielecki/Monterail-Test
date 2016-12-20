(function () {
  'use strict';

  angular
    .module("app")
    .controller("LookCtrl", LookCtrl);

  LookCtrl.$inject = ["$scope", "$stateParams", "looksAPI", "commentAPI", "Auth"];

  function LookCtrl($scope, $stateParams, looksAPI, commentAPI, Auth) {
    $scope.user = Auth.getCurrentUser();
    $scope.id = $stateParams.lookId;
    $scope.popLooks = [];

    looksAPI.findOneLook($scope.id)
      .then(function (data) {
        console.log(data);

        $scope.look = data.data;
      })
      .catch(function (err) {
        console.log("Failed to get look ", err);
      });

    looksAPI.popLooks($scope.id)
      .then(function (data) {
        console.log(data);

        $scope.popLooks = data.data;
      })
      .catch(function (err) {
        console.log("Failed to get pop look ", err);
      });

    commentAPI.getComments($scope.id)
      .then(function (data) {
        console.log(data);
        $scope.comments = data.data;
      })
      .catch(function (err) {
        console.log("Failed to get comments " + err);
      });

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

    $scope.postComment = function () {
      var comment = {
        authorId: $scope.user._id,
        authorName: $scope.user.name,
        authorEmail: $scope.user.email,
        gravatar: $scope.user.gravatar,
        comment: $scope.comment.body,
        lookId: $scope.id
      };

      commentAPI.addComment(comment)
        .then(function (data) {
          console.log(data);
          $scope.comment.body = "";
          $scope.comments.splice(0, 0, data.data);
        })
        .catch(function (err) {
          console.log("Failed to post comment " + err);
        });
    };
  }
})();
