var image = require('../controllers/image'),
	home = require('../controllers/home'),
	comment = require('../controllers/comment'),
	user = require('../controllers/user'),
	helpers = require('../controllers/helpers'),
	search = require('../controllers/search'),
  express = require('express'),
	router = express.Router();
// console.log(router);
	router.get('/images/user/:user_id', image.index);
	router.get('/images/:image_id', image.imageGet);
	router.get('/helpers/stats/:user_id',helpers.stats);
	router.get('/helpers/latestComment/:user_id',helpers.latestComment);
	router.get('/helpers/popularImage/:user_id',helpers.popularImage);
	router.get('/authenticate/me', user.authenticate);
	router.get('/search/:query',search.index);

	router.post('/images', image.imageCreate);
	router.post('/images/:image_id/like', image.like);
	router.post('/images/:image_id/comment', comment.insert);

	router.post('/signin', user.create);
	router.post('/login', user.login);
	router.post('/facebook', user.facebook);
	module.exports = router;
