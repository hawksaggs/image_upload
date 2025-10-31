var request = require('request'),
    cookieParser = require('cookie');
var requestOptions = {
  server: "http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  requestOptions.server = "https://fast-ocean-83004.herokuapp.com";
}
module.exports = {
  authenticate: function(token,callback){
    if(token != 'undefined'){
      this.path = '/api/authenticate/me';
      this.apiRequest = {
        url:requestOptions.server + this.path,
        method:'GET',
        qs:{token:token}
      },
      request(this.apiRequest, function(err, response, body){
        if(err){ return callback(err,null);}
        return callback(null,response);
      });
    }else{
      return callback(res.status(400).json("No Token"),null);
    }
  }
}
