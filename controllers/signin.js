var request = require('request');
var MD5 = require('MD5');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
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
    // console.log(req.session);
    // console.log(req.session.user);
    // console.log(req.user);
    if(req.session.user){
      res.redirect('/'+req.session.user[0]._id);
    }else if(req.user){
      var session = req.session;
      session.user = [];
      session.user[0] = req.user;
      // console.log(req.session.user[0]);
      res.redirect('/'+req.session.user[0]._id);
    }else{
      res.render('signin',{layout:false});
    }

  },
  create: function(req, res){
    var postdata,path,requestOptions;
    path = apiOptions.server + '/api/signin';
    postdata = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
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
      if(body.length > 0){
        var session = req.session;
        session.user = body;
        var username = body[0].email.split("@");
        session.user[0].username = username[0];
        var viewModel = {
          message:"Login Successfully",
          success: true,
          data:req.session.user[0]
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
  facebook:function(req, res){
    // console.log(req);
    var data = req.body.data;
    // console.log(data);
    if(data){
      var session = req.session;
      session.user = data;
      var username = data[0].facebook.id;
      session.user[0].username = username;
      // console.log(req.session);
      var viewModel = {
        message:"Login Successfully",
        success: true,
        data:req.session.user
      }
    } else {
      var viewModel = {
        message:req.body.message,
        success: false
      }
    }
    res.send(viewModel);
    // res.redirect('/'+username);
  }
};
