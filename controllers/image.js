var fs = require('fs'),
path1 = require('path'),
sidebar = require('../helpers/sidebar'),
// Models = require('../models'),
md5 = require('MD5');
var request = require('request');
var cloudinary = require('cloudinary');
// var sendJsonResponse = function(res, status, content){
// 	res.status = status;
// 	res.json(content);
// };
// var imagemagick = require('imagemagick');
var imageResize = require('node-image-resize');
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
      user:req.session.user[0],
    };
    sidebar(viewModel, function(viewModel){
        res.render('image', viewModel);
    });

  }

};
module.exports = {
  index: function (req, res) {

    var requestOptions, path;
    var viewModel = {
      image:{}
    };
    path = '/api/images/'+ req.params.image_id;
    requestOptions = {
      url: apiOptions.server + path,
      method:'GET',
      json:{}
    },
    request(requestOptions, function(err, response, body){
      // console.log(body);
      if(err){ throw err;}
      else {
        renderIndexPage(req, res, body);
      }
    });
  },
  create: function (req, res) {
    // console.log(req);
    var saveImage = function(){
      var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
      imgUrl = '';
      for(var i = 0; i < 6; i += 1){
        imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      var tempPath = req.file.path,
      ext = path1.extname(req.file.originalname).toLowerCase(),
      targetPath = path1.resolve('./public/upload/'+ imgUrl + ext);
      if(req.session.user){
        if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' ){
          // fs.rename(tempPath, targetPath, function(err){
          //   if(err) {throw err;}
          // });
          cloudinary.uploader.upload(tempPath,function(result){
            // console.log(req.body);
            // console.log(result);
            // console.log(result.secure_url);
            if(result.secure_url){
              var requestOptions, postdata,path;
              path = '/api/images';
              postdata = {
                title: req.body.title,
                description: req.body.description,
                filename:result.secure_url,
                user_id:req.session.user[0]._id
              };
              requestOptions = {
                url: apiOptions.server + path,
                method: "POST",
                json: postdata
              };
              // console.log(requestOptions);
              request(requestOptions, function(err,response, body){
                // console.log(body);
                // console.log(response);
                if(err) {throw err;}
                else {res.redirect('/images/'+ body._id);}
              });
            }

          });
          // console.log(targetPath);
          // console.log(gulp);
          // var image = new imageResize(imgUrl+ext);
          // console.log(image);
          // image.isLoaded.then(function(){
          //   image.smartResizeDown({
          //     width:200,
          //     height:200
          //   }).then(function(){
          //     image.stream(function(err, stdout, stderr){
          //       var writeStream = fs.createWriteStream(targetPath);
          //       stdout.pipe(writeStream);
          //     });
          //   });
          // });

        }
      } else {
        res.redirect('/signin',{layout:false});
      }
    };
    saveImage();
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
    // console.log(req.session);
    var requestOptions, postdata,path;
    path = '/api/images/'+ req.params.image_id + '/comment';
    postdata = {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      gravatar: md5(req.body.email),
      user_id:req.session.user[0]._id,
    };
    requestOptions = {
      url: apiOptions.server + path,
      method: "POST",
      json: postdata
    };
    request(requestOptions, function(err, response, body){
      if(err){throw err;}
      else {
        console.log(body);
        res.redirect('/images/'+ body.image_id);
      }
    });
  }
};
