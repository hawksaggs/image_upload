var mongoose = require('mongoose');
var Comment = require('../model/comment');
var Image = require('../model/image');
var async = require('async');
var sendJsonResponse = function(res, status, content){
  res.status = status;
  res.json(content);
};

module.exports = {
  stats: function(req, res){
    this.user_id = req.params.user_id;

    async.parallel([
      function(callback){
        commentCount(this.user_id, callback);
      },
      function(callback){
        imageStats(this.user_id, callback);
      }
    ], function(err, result){
      if(err){
        sendJsonResponse(res,400,err);
      }
      var finalData = {
        comments:result[0].comments,
        images:result[1].images,
        likes:result[1].likes,
        views:result[1].views
      };
      // console.log(finalData);
      sendJsonResponse(res,200,finalData);
    });
    function commentCount(user_id, callback) {
      var comment_count = 0;
      Comment.find({"user_id":user_id}, function(err, comment){
        if(err){ callback(err,null); }
        if(comment){
          comment.forEach(function(doc){
              comment_count += 1;
          });
          var response = {
            comments: comment_count
          };
          callback(null, response);
        }
      })
    }

    function imageStats(user_id, callback) {
      var image_count = view_count = likes_count = 0;
      Image.find({"user_id":user_id}, function(err,image){
        if(err){
          callback(err, null);
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
          // sendJsonResponse(res,200,response);
          callback(null, response);
        }
      });
    }
  },
  latestComment: function(req,res){
    // console.log(req.params.user_id);
    Comment.aggregate(
      {$match:{"user_id":mongoose.Types.ObjectId(req.params.user_id)}},
      // {$lookup:{
      //   from:'images',
      //   localField:'image_id',
      //   foreignField:'_id',
      //   as:'image'
      // }},
      {$limit:5},
      {$sort:{'timestamp':-1}}
      ).
      exec(function(err, result){
      // console.log(result);
      if(err){ return sendJsonResponse(res,400,err);}
      async.forEach(result,function(comment,callback){
        Image.findOne({_id:comment.image_id}).exec(function(err, image){
          if(err){return sendJsonResponse(res, 500, err);}
          result.image = image;
          callback(null);
        });
      },function(err){
        if(err){return sendJsonResponse(res, 500, err);}
        return sendJsonResponse(res, 200, result);
      });
    });
  },
  popularImage: function(req, res){
    // console.log(req.params.user_id);
    Image.aggregate(
      {$match:{"user_id":mongoose.Types.ObjectId(req.params.user_id)}},
      {$limit:5},
      {$sort:{'likes':-1}}
      ).
      exec(function(err, result){
      // console.log(result);
      if(err){
          return sendJsonResponse(res,400,err);
        }
        return sendJsonResponse(res,200,result);
    });
  }
}
