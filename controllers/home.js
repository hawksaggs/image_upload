var request = require('request');
var sidebar = require('../helpers/sidebar');
var authenticate = require('../helpers/authenticate');
var cookieParser = require('cookie');
var async = require('async');
var requestOptions = {
  server: "http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  requestOptions.server = "https://fast-ocean-83004.herokuapp.com";
}
var renderHomePage = function(req, res, data){
  if(data){
    var viewModel = {
      success: true,
      images:data.images,
      user:data.user
    };
  } else {
    var viewModel = {
      success: false,
      // images:data
    };
  }

  sidebar(viewModel, function(viewModel){
      res.render('index',viewModel);
  });

}

module.exports = {
  index: function (req, res) {
    this.path,this.apiRequest;
    this.cookie = cookieParser.parse(req.headers.cookie);
    if(this.cookie.token != undefined){
      async.waterfall([
        function(callback){
          authenticate.authenticate(this.cookie.token, callback);
        },
        function(isAuthenticated,callback){
          if(isAuthenticated.statusCode === 500 || isAuthenticated.statusCode === 400){
            res.redirect('/');
          }else if(isAuthenticated.statusCode === 200){
            this.data = JSON.parse(isAuthenticated.body);
            this.path = '/api/images/user/'+this.data._id;
            this.apiRequest = {
              url:requestOptions.server + path,
              method:'GET',
              json: {}
            },
            request(apiRequest, function(err, response, body){
              if(err){ return callback(err, null);}
              this.data = {};
              this.data.user = JSON.parse(isAuthenticated.body);
              this.data.images = body;
              return callback(null,this.data);
            });
          }
        }
      ], function(err, result){
        if(err){ return res.redirect('/');}
        return renderHomePage(req, res, result);
      });
    }else{
      res.redirect('/')
    }
  },
  // signout: function(req, res){
  //   console.log(req);
  //   // req.session.destroy();
  //   // res.redirect('/');
  //   var viewModel = {
  //     // message:body.message,
  //     success: false
  //   }
  //   res.send(viewModel);
  // }
};
