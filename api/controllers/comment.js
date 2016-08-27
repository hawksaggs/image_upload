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
      gravatar: req.body.gravatar,
      user_id: req.body.user_id
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

  },
  getNewestComment: function(req,res){
    var result = [];
    if(req.params.user_id){
      var cursor = comment.find({"user_id":req.params.user_id}).limit(5).sort({"timestamp":-1});
      var count = 0;
      cursor.forEach(function(doc){
        result[count] = doc;
        count = count + 1;
      },function(err){
        if (err){sendJsonResponse(res,400,err);}
        sendJsonResponse(res,200,result);
      }
    );
  }else{
    sendJsonResponse(res, 400,"");
  }
}
}
