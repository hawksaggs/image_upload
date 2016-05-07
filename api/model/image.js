var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	title: {type:String},
	description: {type:String},
	filename: {type:String},
	views: {type:Number, 'default':0},
	likes: {type:Number, 'default':0},
	timestamp: {type:Date, 'default':Date.now},
	user_id: {type:mongoose.Schema.ObjectId}
});
// console.log(imageSchema);
  module.exports = mongoose.model('Image', imageSchema);
