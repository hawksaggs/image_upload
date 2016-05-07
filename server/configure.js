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
	session = require('express-session');


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

	//app.use(connect.methodOverride());
	app.use(methodOverride());
	// app.use(connect.cookieParser('some-secret-value-here'));
	app.use(cookieParser('some-secret-value-here'));
	app.use(session({secret:'hahaha'}));
	//app.use(app.router);
	// app.use('/public/', connect.static(path.join(__dirname, '/public')));
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	if ('development' === app.get('env')) {
	// app.use(connect.errorHandler());
	app.use(errorHandler());
	}
	app.use('/',routes);
	app.use('/api',routesApi);
	// routes(app);
	return app;
};
