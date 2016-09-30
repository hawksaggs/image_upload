var Comments = require('./comments'),
    Images = require('./images'),
    Stats = require('./stats'),
    async = require('async');
var request = require('request');
var requestOptions = {
  server: "http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  requestOptions.server = "https://fast-ocean-83004.herokuapp.com";
}

module.exports = function(viewModel, callback){
  // console.log(viewModel);
  var data = viewModel.user._id;
    async.parallel({
      stats : function(callback){
        stats(data, callback);
      },
      comments:function(callback){
        newestComment(data,callback);
      },
      images: function (callback) {
        popularImage(data,callback);
      }
    },function(error, result){
      if(error){
        callback(error, null);
      }else{
        // console.log(result);
        viewModel.sidebar = result;
        callback(viewModel);
      }
    });
    function newestComment(data,callback) {
      // console.log(data.toString());
      this.path = '/api/helpers/latestComment/'+data;

      this.apiRequest = {
        url:requestOptions.server + this.path,
        method:'GET',
        json: {}
      };

      request(this.apiRequest, function(err, response, body){
        if(err){ callback(err, null);}else{
        // console.log(body);
        callback(null,body);
      }
      });
    };

    function stats(data, callback){
      this.path = '/api/helpers/stats/' + data;

      this.apiRequest = {
        url: requestOptions.server + this.path,
        method: 'GET',
        json: {}
      };

      request(this.apiRequest, function(err, response, body){
        if(err){callback(err, null);}else{
        // console.log('stats');
        // console.log(body);
        callback(null,body);
      }
      });
    };

    function popularImage(data, callback){
      this.path = '/api/helpers/popularImage/' + data;

      this.apiRequest = {
        url: requestOptions.server + this.path,
        method: 'GET',
        json: {}
      };

      request(this.apiRequest, function(err, response, body){
        if(err){callback(err, null);}else{
        // console.log('stats');
        // console.log(body);
        callback(null,body);
      }
      });
    };

};
