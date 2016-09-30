const User = require('../model/user');

var sendJsonResponse = function(res, status, content){
	res.status = status;
	res.json(content);
};
module.exports = {
    index: function(req, res){
      var query  = req.params.query;
      var qRegExp = new RegExp('\\b'+query, "i");
      User.find({"first_name":{$regex:qRegExp}},function(err,users){
        var search_response = [];
        users.forEach(function(doc){
          var temp = {}
          temp.first_name = doc.first_name;
          temp.last_name = doc.last_name;
          temp._id = doc._id;
          temp.email = doc.email;
          search_response.push(temp);
        });
				return sendJsonResponse(res,200,search_response);
      });
    }
}
