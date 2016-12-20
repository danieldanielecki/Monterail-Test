(function () {
    'use strict';

    angular
        .module("app")
        .factory("commentAPI", commentAPI);

    commentAPI.$inject = ["$http"];

    function commentAPI($http) {
        return ({
            addComment: addComment,
            getComments: getComments
        });

        function addComment(comment) {
            return $http.post("/api/comments", comment);
        }

        function getComments(id) {
            return $http.get("/api/comments/" + id, {
                cache: true // If we navigate to the look again the comments will just automatically load without restarting server.
            });
        }
    }
})();
