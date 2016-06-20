var Comments = require('./comments.js');
var async = require('async');
module.exports = function(viewModel, callback){
  async.parallel([
    function(next){
      Comments.newest(next);
    }
  ], function(err, results){
    viewModel.sidebar = {
      comments: results[0]
    };
    callback(viewModel);
  });
}
