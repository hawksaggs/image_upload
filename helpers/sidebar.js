var Comments = require('./comments'),
    Images = require('./images'),
    Stats = require('./stats');

module.exports = function(viewModel, callback){
  // console.log(viewModel);
    viewModel.sidebar = {
      stats:Stats(viewModel),
      popular:Images.popular(),
      comments:Comments.newest()
    };
    callback(viewModel);
};
