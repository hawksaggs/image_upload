var request = require('request');
var MD5 = require('MD5');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var async = require('async');
var cookieParser = require('cookie');
var authenticate = require('../helpers/authenticate');
var apiOptions = {
  server:"http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = "https://fast-ocean-83004.herokuapp.com";
}
var renderSigninPage = function(req, res, data){
  var viewModel = {
    message:data.message,
    success:data.success
  };
  res.send(viewModel);
}
module.exports = {
  index: function(req, res){
    this.username;
    this.path,this.apiRequest;
    if(req.headers.hasOwnProperty('cookie')){
      this.cookie = cookieParser.parse(req.headers.cookie);
      if(this.cookie.token != undefined){
        async.waterfall([
          function(callback){
            authenticate.authenticate(this.cookie.token, callback);
          },
          function(isAuthenticated,callback){
            if(isAuthenticated.statusCode === 500 || isAuthenticated.statusCode === 400){
              res.render('signin',{layout:false});
            }else if(isAuthenticated.statusCode == 200){
              this.data = JSON.parse(isAuthenticated.body);
              this.username = this.data.email.split('@');
              this.username = this.username[0];
              res.redirect('/'+this.username);
            }
            // callback(null,isAuthenticated);
          }
        ], function(err, result){
          if(err){ return res.redirect('/');}
        });
      }else{
        res.render('signin',{layout:false});
      }
    }else{
      res.redirect('/');
    }

  },
  create: function(req, res){
    var postdata,path,requestOptions;
    path = apiOptions.server + '/api/signin';
    var username = req.body.email.split('@');
    username = username[0];
    postdata = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: MD5(req.body.password),
      username:username,
      gravator:md5(username)
    };
    requestOptions = {
      url: path,
      method:'POST',
      json:postdata
    };
    request(requestOptions, function(err, response, body){
      if(err){throw err;}
      else {
        renderSigninPage(req, res, body);
      }
    });
  },
  login: function(req, res){
    var postdata,path,requestOptions;
    path = apiOptions.server + '/api/login';
    postdata = {
      email: req.body.email,
      password: MD5(req.body.password)
    };
    requestOptions = {
      url: path,
      method:'POST',
      json:postdata
    };
    request(requestOptions, function(err, response, body){
      if(err){throw err;}
      if(response.statusCode === 200){
        body.username = body.email.split("@");
        var viewModel = {
          message:"Login Successfully",
          success: true,
          data:body
        }
      } else {
        var viewModel = {
          message:body.message,
          success: false
        }
      }
      res.send(viewModel);
    });
  },
  // facebook:function(req, res){
  //   // console.log(req);
  //   var data = req.body.data;
  //   // console.log(data);
  //   if(data){
  //     var session = req.session;
  //     session.user = data;
  //     var username = data[0].facebook.id;
  //     session.user[0].username = username;
  //     // console.log(req.session);
  //     var viewModel = {
  //       message:"Login Successfully",
  //       success: true,
  //       data:req.session.user
  //     }
  //   } else {
  //     var viewModel = {
  //       message:req.body.message,
  //       success: false
  //     }
  //   }
  //   res.send(viewModel);
  //   // res.redirect('/'+username);
  // }
};
