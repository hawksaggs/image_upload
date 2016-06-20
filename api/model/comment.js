var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	image_id: {type:mongoose.Schema.ObjectId},
	user_id: {type:mongoose.Schema.ObjectId},	
	email: {type:String},
	name: {type:String},
	gravatar: {type:String},
	comment: {type:String},
	timestamp: {type:Date, 'default':Date.now}
});

module.exports = mongoose.model('Comment', commentSchema);
