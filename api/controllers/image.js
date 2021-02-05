var mongoose = require('mongoose'),
	Image = require('../model/image'),
	Comment = require('../model/comment'),
	User = require('../model/user'),
	async = require('async')
	;
var sendJsonResponse = function(res, status, content){
	res.status = status;
	res.json(content);
};

module.exports = {

	index: function(req, res){
// console.log(req);
		// Image.find({"user_id":req.params.user_id}, function(err, image){
		// 	// console.log(image);
		// 	if(err) {sendJsonResponse(res, 400, err);}
		// 	else { sendJsonResponse(res, 200, image);}
		// }).limit(6);
		Image.aggregate(
			{$match:{'user_id':mongoose.Types.ObjectId(req.params.user_id)}},
			// {$lookup:{
			// 	from:'users',
			// 	localField:'user_id',
			// 	foreignField:'_id',
			// 	as:'user'
			// }},
			{$limit:6},
			{$sort:{'timestamp':-1}}
			).exec(function(err, image){
			if(err) {return sendJsonResponse(res, 500, err);}
			// return  sendJsonResponse(res, 200, image);
			async.forEach(image,function(data,callback){
				User.findOne({_id:data.user_id}).exec(function(err,user){
					if(err){ return sendJsonResponse(res, 500, err); }
					image.user = user;
					callback(null);
				});
			},function(err){
				// console.log(image);
				if(err) {return sendJsonResponse(res, 500, err);}
				return sendJsonResponse(res, 200, image);
			});
		});
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
	},
	delete: function(req, res) {
		var imageId = req.params.imageId;
		var userId = req.params.userId;
		if (!imageId) return sendJsonResponse(res,400, 'image id is required');
		
		Image.deleteOne({ "_id": imageId, 'user_id': userId }, function(err, image) {
			if(err){ return sendJsonResponse(res, 400, err);}
			Comment.deleteMany({ 'image_id': imageId }, function(err, comment) {
				if(err){ return sendJsonResponse(res, 400, err);}

				return sendJsonResponse(res, 200, 'deleted');
			});
		});
	}
};
