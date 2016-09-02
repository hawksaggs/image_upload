var home = require('../controllers/home'),
	image = require('../controllers/image'),
	signin = require('../controllers/signin'),
	logout = require('../controllers/logout'),
	passport = require('passport'),
    express = require('express'),
	router = express.Router();

	router.get('/', signin.index);
	router.get('/:username', home.index);
	router.get('/images/:image_id', image.index);
	router.get('/signin',signin.index);
	// router.get('/auth/facebook',signin.facebook);
	// router.get('signout', home.signout);
	// router.get('/logout1', function(req, res){
	// 	req.session.destroy(function(){
	// 		res.redirect('/');
	// 	});
	// });
	router.post('/signin',signin.create);
	// router.post('/facebook',signin.facebook);
	router.post('/login',signin.login);
	router.post('/images', image.create );
	router.post('/images/:image_id/like', image.like);
	router.post('/images/:image_id/comment', image.comment);


	module.exports = router;
