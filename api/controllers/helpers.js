var mongoose = require('mongoose');

var Comment = require('../model/comment');
var Image = require('../model/image');

var sendJsonResponse = function(res, status, content){
  res.status = status;
  res.json(content);
};

module.exports = {
  stats: function(req, res){
    var image_count = view_count = likes_count = 0;
    Image.find({"user_id":req.params.user_id}, function(err,image){
      if(err){
        sendJsonResponse(res,400,err);
      }
      if(image){
        image.forEach(function(doc){
          image_count += 1;
          likes_count += doc.likes;
          view_count += doc.views;
        });
        var response = {
          'images':image_count,
          'likes':likes_count,
          'views':view_count
        };
        sendJsonResponse(res,200,response);
      }
    });
  }
}
