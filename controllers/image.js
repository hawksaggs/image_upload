var fs = require('fs'),
    path1 = require('path'),
    sidebar = require('../helpers/sidebar'),
    authenticate = require('../helpers/authenticate'),
    cookieParser = require('cookie'),
    async = require('async'),
    md5 = require('MD5'),
    request = require('request'),
    cloudinary = require('cloudinary'),
    imageResize = require('node-image-resize');
cloudinary.config({
  cloud_name: 'hawksaggs',
  api_key: '829366987741749',
  api_secret: 'X4OOLklvZqxR8XDYcN1P7VALNUo'
});
var apiOptions = {
  server:"http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = "https://fast-ocean-83004.herokuapp.com";
}
var _showError = function(req, res, status){
  var title, content;
  if(status === 404){
    title = "404, Page Not Found";
    content = "Oh dear. Look like we can't find this page. Sorry.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {title: title, content: content});
};
var renderIndexPage = function(req, res, data){
  if(data){
    data.views = data.views + 1;
    var viewModel = {
      image:{
        title: data.image.title,
        description: data.image.description,
        filename: data.image.filename,
        views: data.image.views,
        likes: data.image.likes,
        uniqueId: data.image._id,
        timestamp: data.image.timestamp
      },
      comments:data.comment,
      user:data.user,
    };
    sidebar(viewModel, function(viewModel){
        res.render('image', viewModel);
    });

  }

};
module.exports = {
  index: function (req, res) {
    this.path,this.apiRequest;
    this.image_id = req.params.image_id;
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
            this.path = '/api/images/'+this.image_id;
            this.apiRequest = {
              url:apiOptions.server + path,
              method:'GET',
              json: {}
            },
            request(this.apiRequest, function(err, response, body){
              if(err){ return callback(err, null);}
              this.data = {};
              this.data = body;
              this.data.user = JSON.parse(isAuthenticated.body);
              return callback(null,this.data);
            });
          }
        }
      ], function(err, result){
        if(err){ return res.redirect('/');}
        return renderIndexPage(req, res, result);
      });
    }
  },
  create: function (req, res) {
    this.path,this.apiRequest,this.postdata,this.requestOptions,this.tempPath;
    this.cookie = cookieParser.parse(req.headers.cookie);
    if(this.cookie.token != 'undefined'){
      async.waterfall([
        function(callback){
          authenticate.authenticate(this.cookie.token,callback);
        },
        function(isAuthenticated,callback){
          if(isAuthenticated.statusCode === 500 || isAuthenticated.statusCode === 400){
            res.redirect('/');
          }else if(isAuthenticated.statusCode === 200){
            this.data = JSON.parse(isAuthenticated.body);
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
            for(var i = 0; i < 6; i += 1){
              imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            this.tempPath = req.file.path;
            var ext = path1.extname(req.file.originalname).toLowerCase();
            if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' ){
              cloudinary.uploader.upload(this.tempPath,function(result){
                if(result.secure_url){
                  this.path = '/api/images';
                  this.postdata = {
                    title: req.body.title,
                    description: req.body.description,
                    filename:result.secure_url,
                    user_id:this.data._id
                  };
                  this.requestOptions = {
                    url: apiOptions.server + this.path,
                    method: "POST",
                    json: this.postdata
                  };
                  request(this.requestOptions, function(err,response, body){
                    if(err) {return callback(err,null);}
                    return callback(null,response);
                  });
                }
              });
            }else{
              res.send({success:false,message:"Image extension not supported"});
            }
          }
        }
      ], function(err,result){
        if(err) {return res.send({success:false,message:"Some error occured!!!"});}
        // console.log(result);
        fs.unlink(tempPath,function(err){
          if(err){console.error(err);}
          if(result.statusCode === 200){
          res.redirect('/images/'+ result.body._id);
        }else{
          return res.send({success:false,message:"Some error occured!!!"});
        }
        });
        
      });
    }else{
      res.redirect('/');
    }
},
  like: function (req, res) {
    // console.log(req._remoteAddress);
    var requestOptions, postdata,path;
    path = '/api/images/'+ req.params.image_id + '/like';
    postdata = {};
    requestOptions = {
      url: apiOptions.server + path,
      method: "POST",
      json: {}
    };
    // console.log(request.connection);
    request(requestOptions, function(err, response, body){
      if(err){ throw err;}
      else {
        res.send({"likes":body.likes});
      }
    })
  },
  comment: function (req, res) {
    this.path,this.apiRequest,this.postdata,this.requestOptions;
    this.image_id = req.params.image_id;
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
            isAuthenticated.body = JSON.parse(isAuthenticated.body);
            this.path = '/api/images/'+ this.image_id + '/comment';
            this.postdata = {
              name: req.body.name,
              email: req.body.email,
              comment: req.body.comment,
              gravatar: md5(req.body.email),
              user_id:isAuthenticated.body._id,
            };
            this.requestOptions = {
              url: apiOptions.server + this.path,
              method: "POST",
              json: this.postdata
            };
            request(this.requestOptions, function(err, response, body){
              if(err){return callback(err,null);}
              return callback(null,response);
            });
          }
        }
      ], function(err, result){
        if(err){ return res.redirect('/');}
        res.redirect('/images/'+ result.body.image_id);
      });
    }
  }
};
