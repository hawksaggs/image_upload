var mongoose = require('mongoose');

var comment = require('../model/comment');
var image = require('../model/image');

var sendJsonResponse = function(res, status, content){
  res.status = status;
  res.json(content);
};

module.exports = {
  insert: function(req, res){
    var postdata = {
      name:req.body.name,
      email:req.body.email,
      comment:req.body.comment,
      gravatar: req.body.gravatar
    }
    image.findOne({"_id":req.params.image_id}, function(err, image){
      // console.log(image);
      if(err){sendJsonResponse(res, 400, err);}
      else {
        var newComment = new comment(postdata);
        newComment.image_id = image._id;
        newComment.save(function(err, comment){
          if(err){sendJsonResponse(res, 400, err);}
          else {
            sendJsonResponse(res, 200, comment);
          }
        });
      }

    });

  }
}
