'use strict';

var _ = require('lodash');
var Look = require('./look.model');
var path = require('path');
var utils = require('../../utils/utils.js');

exports.allLooks = function (req, res) {
  Look.find({}) // Mongoose API, will grab all the looks in this model.
    .sort({
      createTime: -1
    })
    .exec(function (err, looks) {
      if (err) {
        return handleError(res, err);
      }
      if (!looks) {
        return res.send(404); // Not found.
      }

      console.log(looks);

      return res.status(200) // Request fulfilled.
        .json(looks);
    });
};

// Query all the looks for the giving user.
exports.userLooks = function (req, res) {
  var userEmail = req.query.email; // On the front-end we're gonna to pass the users email.
  Look.find({
    email: {
      $in: userEmail // Looking for users email in our schemas, because we're gonna to pass users email on the front-end.
    }
  })
    .sort({
      createTime: -1 // Sort users emails by descending.
    })
    .exec(function (err, looks) {
      if (err) {
        return handleError(res, err);
      }
      console.log(looks);
      return res.status(200)
        .json(looks);
    });
};

exports.upload = function (req, res) {
  var newLook = new Look();

  newLook.email = req.body.email;
  newLook.title = req.body.title;
  newLook.description = req.body.description;
  newLook.userName = req.body.name;
  newLook._creator = req.body._creator;
  newLook.createTime = Date.now();
  newLook.upVotes = 0;
  newLook.downVotes = 0;
  newLook.save(function (err, item) {
    if (err) {
      console.log('Error occured saving image.');
    }
    else {
      console.log('Success post saved.');
      console.log(item);
      res.status(200) // Request fulfilled.
        .json(item);
    }
  });
};

// This method is looking for single look, will find a look by passing in the parameters for the look defined on the front-end.
exports.singleLook = function (req, res) {
  Look.findById(req.params.lookId, function (err, look) {
    if (err) {
      return handleError(res, err);
    }
    if (!look) {
      return res.send(404);
    }
    return res.json(look);
  });
};

exports.popLooks = function (req, res) {
  Look.find(req.params.id)
    .sort("-upVotes")
    .limit(6)

    // Mongoose special method to execute.
    .exec(function (err, looks) {
      if (err) {
        return handleError(res, err);
      }
      console.log(looks);

      return res.json(looks);
    });
};

// Method to update look.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Look.findById(req.params.id, function (err, look) {
    if (err) {
      return handleError(res, err);
    }
    if (!look) {
      return res.send(404);
    }
    var updated = _.merge(look, req.body); // Save new title and description for a look.
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      console.log(look);
      return res.json(look);
    });
  });
};

exports.addUpvote = function (req, res) {
  Look.findById(req.params.id, function (err, look) {
    if (err) {
      return handleError(res, err);
    }
    if (!look) {
      return res.send(404);
    }
    look.upVotes++;
    look.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(look);
    });
  });
};

exports.addDownvote = function (req, res) {
  Look.findById(req.params.id, function (err, look) {
    if (err) {
      return handleError(res, err);
    }
    if (!look) {
      return res.send(404);
    }
    look.downVotes++;
    look.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(look);
    });
  });
};

exports.delete = function(req, res) {
  Look.findById(req.params.id, function(err, look) {
    if(err) {
      return handleError(res, err);
    }
    if(!look) {
      return res.send(404);
    }
    look.remove(function(err) {
      if(err) {
        return handleError(res, err);
      }
      return res.send(200);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err); // Internal error.
}
