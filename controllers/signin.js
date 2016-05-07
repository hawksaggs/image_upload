var request = require('request');
var MD5 = require('MD5');
var apiOptions = {
  server:"http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = window.location.href;
}
var renderSigninPage = function(req, res, data){
  console.log(data);
  // req.session.user.first_name = data.first_name;
  // req.session.user.last_name = data.last_name;
  // req.session.user.email = data.email;
  // req.session.user.uniqueId = data._id;
  // console.log(req.session);
  var viewModel = {
    msg:{message:"asass"}
  };
  // console.log(viewModel);
  res.render('signin',{layout:false, data:viewModel});
}
module.exports = {
  index: function(req, res){
    // console.log('hi');
    res.render('signin',{layout:false});
  },
  create: function(req, res){
    // console.log(req.body);
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
    // console.log(requestOptions);
    request(requestOptions, function(err, response, body){
      if(err){res.send(err);}
      else {
        res.send(body);
      }
    });
  },
  login: function(req, res){
    // console.log(req);
    var postdata,path,requestOptions;
    path = apiOptions.server + 'api/login';
    postdata = {
      email: req.body.email,
      password: MD5(req.body.password)
    };
    requestOptions = {
      url: path,
      method:'POST',
      json:postdata
    };
    console.log(requestOptions);
    request(requestOptions, function(err, response, body){
      // console.log(response);
      console.log(body);
      // console.log(body.message);
      if(err){throw err;}
      if(body.length > 0){
        var session = req.session;
        session.user = body;

        var username = body[0].email.split("@");
        session.user[0].username = username[0];
        console.log(req.session);
        // res.redirect('/'+username[0]);
        var viewModel = {
              message:"Login Successfully",
              success: true,
              data:req.session.user[0]
        }
        res.send(viewModel);

      } else{
        var viewModel = {
              message:body.message,
              success: false
        }
        // console.log(viewModel);
        // res.render('signin', {layout:false, data:{
        //   message:body.message,
        // }});
        res.send(viewModel);
      }

    });
  },
  logout: function(req, res){
    req.session.destroy();
    res.redirect('/');
  }
}
