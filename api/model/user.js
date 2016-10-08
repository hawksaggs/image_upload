var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  first_name: {type:String},
  last_name: {type:String},
  email: {type:String},
  username:{type:String},
  gravatar:{type:String},
  password:{type:String},
  facebook:{id:{type:String}},
  google:{id:{type:String}},
  profile_picture: {type:String},
  profile_picture_id: {type:String},
  profile_picture_version: {type:String}
});

userSchema.index({first_name:'text',last_name:'text'});

module.exports = mongoose.model('User', userSchema);
