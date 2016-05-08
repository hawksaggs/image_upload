var home = require('../controllers/home'),
	image = require('../controllers/image'),
	signin = require('../controllers/signin'),
	logout = require('../controllers/logout');
	var express = require('express'),
	router = express.Router();

	router.get('/', signin.index);
	router.get('/:username', home.index);
	router.get('/images/:image_id', image.index);
	router.get('/signin',signin.index);
	router.post('/signin',signin.create);
	router.post('/login',signin.login);
	router.post('/images', image.create );
	router.post('/images/:image_id/like', image.like);
	router.post('/images/:image_id/comment', image.comment);
	router.get('/logout', signin.logout);
	// router.post('/logout', logout.index);
	module.exports = router;
