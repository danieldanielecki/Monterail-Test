var Comment = require('./comment.model');

exports.addComment = function (req, res) {
    var newComment = new Comment(); // Available because of exports mongoose model like a Comment in comment.model.js.
    newComment.author.id = req.body.authorId;
    newComment.author.name = req.body.authorName;
    newComment.author.email = req.body.authorEmail;
    newComment.gravatar = req.body.gravatar;
    newComment.comment = req.body.comment;
    newComment.lookId = req.body.lookId;
    newComment.createTime = Date.now();

    newComment.save(function (err, comment) {
        if (err) {
            console.log("Error saving comment.");
            return res.send(500);
        }
        else {
            console.log(comment);
            res.status(200).json(comment);
        }
    });
};


exports.getComments = function (req, res) {
    Comment.find({
        "lookId": req.params.id
    })
    .sort({
        createTime: -1 // Descending, it means display the newest comments first.
    })
    .exec(function (err, comments) {
        // Error handlers.
        if (err) {
            return res.send(500);
        }
        if (!comments) {
            return res.send(404);
        }

        // If no errors then send comments to the front-end.
        return res.status(200).json(comments);
    });
};
