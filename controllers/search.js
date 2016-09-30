const request = require('request');
const authenticate = require('../helpers/authenticate');
const cookieParser = require('cookie');
const async = require('async');
var requestOptions = {
  server: "http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  requestOptions.server = "https://fast-ocean-83004.herokuapp.com";
}
module.exports = {
  index: function(req,res){
    // console.log(req.query);
    var query = req.query.q;
    this.path,this.apiRequest;
    this.cookie = cookieParser.parse(req.headers.cookie);
    if(this.cookie.token != undefined || this.cookie.token != ''){
      async.waterfall([
        function(callback){
          authenticate.authenticate(this.cookie.token, callback);
        },
        function(isAuthenticated,callback){
          console.log(isAuthenticated.statusCode);
          if(isAuthenticated.statusCode === 500 || isAuthenticated.statusCode === 400){
            res.redirect('/');
          }else if(isAuthenticated.statusCode === 200){
            this.data = JSON.parse(isAuthenticated.body);
            this.path = '/api/search/'+query;
            this.apiRequest = {
              url:requestOptions.server + path,
              method:'GET',
              json: {}
            },
            request(apiRequest, function(err, response, body){
              // console.log(body);
              if(err){ return callback(err, null);}
              return callback(null,body);
            });
          }
        }
      ], function(err, result){
        if(err){ return res.redirect('/');}
        // console.log(result);
        res.send(result);
      });
    }else{
      res.redirect('/')
    }
  },
};
