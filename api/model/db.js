var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost:27017/facsimile';
if(process.env.NODE_ENV == 'production'){
		var dbURI = 'mongodb://ayushmittal:748244hawks@ds023468.mlab.com:23468/facsimile';
}

mongoose.connect(dbURI);
mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error ' + err);
});
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected ');
});
require('./image');
require('./comment');
