var request = require('request');
var requestOptions = {
  server: "http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  requestOptions.server = "https://fast-ocean-83004.herokuapp.com";
}
var path,apiRequest,getData;
var stats = {};
module.exports = function(viewModel){
  path = '/api/helpers/stats/'+viewModel.user._id;

  apiRequest = {
    url:requestOptions.server + path,
    method:'GET',
    json: {}
  },
  // var stats = {
  //   images: '',
  //   comments: '',
  //   views: '',
  //   likes: ''
  // };
  request(apiRequest, function(err, response, body){
    // console.log('sas');
    // console.log(body);
    // console.log(response);
    if(err){ throw err;}
    // else {
      // console.log(body);
      stats = {
        images: body.images,
        comments: 0,
        views: body.views,
        likes: body.likes
      };
      console.log(stats);
      return stats;

    // }

  });


};
