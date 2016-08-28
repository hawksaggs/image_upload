var User = require('../model/user');
var mongoose = require('mongoose');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports = {
  create: function(req, res){
    User.find({"email":req.body.email}, function(err, user){
      if(err){ return sendJsonResponse(res, 400, err);}
      // console.log('user:'+user);
      if(user.length > 0){return sendJsonResponse(res, 400, {"message":"User is already registered","success":false});}
      User.create({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:req.body.password
      }, function(err, userData){
        if(err){return sendJsonResponse(res, 400, err);}
        return sendJsonResponse(res, 200, {"data":userData,"success":true,"message":"Account created successfully"});
      });
    });
  },
  login: function(req, res){
    // console.log(req);
    User.find({"email": req.body.email,"password":req.body.password}, function(err, user){
      if(err){ return sendJsonResponse(res, 400, err);}
      if(user.length > 0){
        return sendJsonResponse(res, 200, user);
      } else {
        return sendJsonResponse(res, 400, {"message":"Invalid Username or Password"});
      }

    });
  },
  facebook: function(req, res){
    User.find({"facebook.id":req.body.id}, function(err, user){
      if(err){
        return sendJsonResponse(res, 400, err);
      }else{
        if(user.length > 0){
          return sendJsonResponse(res, 200, user);
        }else{
            User.create({
              first_name:req.body.name,
              facebook:{id: req.body.id}
            }, function(err, userData){
              if(err){return sendJsonResponse(res, 400, err);}
              return sendJsonResponse(res, 200, {"data":userData,"success":true,"message":"Account created successfully"});
            });
        }
      }
    });
  }
}
