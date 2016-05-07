var mongoose = require('mongoose');

var Image = require('../model/image');
var Comment = require('../model/comment');
// console.log(Image);
var sendJsonResponse = function(res, status, content){
	res.status = status;
	res.json(content);
};

module.exports = {

	index: function(req, res){
// console.log(req);
		Image.find({"user_id":req.params.user_id}, function(err, image){
			// console.log(image);
			if(err) {sendJsonResponse(res, 400, err);}
			else { sendJsonResponse(res, 200, image);}
		}).limit(6);
	},
	imageCreate: function(req, res){
		// console.log(Image);
		Image.create({
			title: req.body.title,
			description: req.body.description,
			filename: req.body.filename,
			user_id:req.body.user_id
		}, function(err, image){
			if(err) {
					sendJsonResponse(res, 400, content);
			}else {
				sendJsonResponse(res, 200, image);
			}
		});
	},
	imageGet: function(req, res){
		// console.log(req);
    var Response = {
      image:{},
      comment:[]
    }
		Image.findOne({"_id" : req.params.image_id},function(err, image){
			if(err){ sendJsonResponse(res, 400, err);}
			else {
        if(image){
          Response.image = image;
          Comment.find({"image_id":image._id}, function(err, comment){
            if(err){sendJsonResponse(res, 400, err);}
            else {
                Response.comment = comment;
                sendJsonResponse(res, 200, Response);
            }
          });
        }
			}
		});
	},
	like : function(req, res){
		Image.findOne({"_id": req.params.image_id}, function(err, image){
			if(err){ sendJsonResponse(res, 400, err);}
			else {
				image.likes = image.likes + 1;
				image.save(function(err){
					if(err){ sendJsonResponse(res,400,err);}
					else {
						sendJsonResponse(res, 200, image);
					}
				})
				}

		});
	}
};
