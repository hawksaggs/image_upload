var express = require('express'),
	path =require('path'),
	routes = require('./routes'),
	routesApi = require('../api/server/routes'),
	exphbs = require('express-handlebars'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	errorHandler = require('errorhandler'),
	moment = require('moment'),
	multer = require('multer'),
	request = require('request'),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	session = require('express-session');
	var apiOptions = {
	  server:"http://localhost:5000"
	};
	if(process.env.NODE_ENV === 'production'){
	  apiOptions.server = "https://fast-ocean-83004.herokuapp.com";
	}


module.exports = function(app) {
	//configuration code.....
	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views')+'/layouts',
		partialsDir: [app.get('views') + '/partials'],
		helpers:{
			timeago: function(timestamp){
				return moment(timestamp).startOf('minute').fromNow();
			}
		}
	}).engine);
	app.set('view engine', 'handlebars');

	//app.use(connect.logger('dev'));
	app.use(morgan('dev'));
	// app.use(connect.bodyParser({
	// uploadDir:path.join(__dirname, '../public/upload/temp')
	// }));
	app.use(bodyParser.urlencoded({'extended': true}));
	app.use(bodyParser.json());
	app.use(multer({dest:path.join(__dirname, '../public/upload/temp')}).single('file'));
	app.use(methodOverride());
	app.use(cookieParser('some-secret-value-here'));
	app.use(session({secret:'hahaha'}));
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	if ('development' === app.get('env')) {
	app.use(errorHandler());
	}
	app.get('/signout', function(req, res){
		if(req.session.user){
			req.session.destroy(function(){
				res.redirect('/');
			});
		}else{
				res.redirect('/');
		}
});

	passport.serializeUser(function(user,done){
    done(null,user.id);
  });
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
  passport.use(new FacebookStrategy({
      clientID : '589099754591838',
      clientSecret: '62a12af88a52b66775efa44ff9bf9046',
      callbackURL: 'http://localhost:5000/auth/facebook/callback',

  }, function(token, refreshToken, profile, done){
    console.log(profile);
    process.nextTick(function(){
			var postdata,path,requestOptions;
	    path = apiOptions.server + '/api/facebook';
	    postdata = {
	      name: profile.displayName,
	      id: profile.id,
				// if(!empty(profile.emails)){
	      // email:profile.emails[0].value
			// }
	    };
	    requestOptions = {
	      url: path,
	      method:'POST',
	      json:postdata
	    };
			request(requestOptions,function(err, response, body){
				// console.log(body);
				if(err){throw err;}
				path = apiOptions.server + '/facebook';
				postdata = {
					data:body,
				};
				requestOptions = {
		      url: path,
		      method:'POST',
		      json:postdata
		    };
				request(requestOptions,function(err, response, body){
					if(err){throw err;}
					// if(body.length > 0){
          //   if(body.success){
          //     response.redirect('/'+body.data[0].username);
          //   }else{
          //     response.redirect('/');
          //   }
          // }else{
          //   response.redirect('/');
          // }
				});
			});
    });
  }));

	app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));
	app.get('/auth/facebook/callback',passport.authenticate('facebook', {successRedirect : '/',failureRedirect: '/login'}),function(req, res) {res.redirect('/');});
	app.use('/',routes);
	app.use('/api',routesApi);

	// routes(app);
	return app;
};
