var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  first_name: {type:String},
  last_name: {type:String},
  email: {type:String},
  password:{type:String},
  facebook:{id:{type:String}}
});

module.exports = mongoose.model('User', userSchema);
