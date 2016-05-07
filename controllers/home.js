var request = require('request');
var requestOptions = {
  server: "http://localhost:5000"
};
if(process.env.NODE_ENV === 'production'){
  requestOptions.server = "https://fast-ocean-83004.herokuapp.com";
}
var renderHomePage = function(req, res, data){
  if(data){
    var viewModel = {
      success: true,
      images:data,
      user:req.session.user[0]
    };
  } else {
    var viewModel = {
      success: false,
      // images:data
    };
  }

  // var i=0;
  // data.forEach(function(index){
  //    console.log(index);
  //    viewModel.images[i]['uniqueId'] = index._id;
  //    viewModel.images[i]['filename'] = index.filename;
  //    viewModel.images[i]['title'] = index.title;
  //    i=i+1;
  //
  // });
  // console.log(viewModel);
  res.render('index',viewModel);
}
module.exports = {
  index: function (req, res) {
    // console.log(req.session.user);
    if(req.session.user){
      var path,apiRequest;
      path = '/api/images/user/'+req.session.user[0]._id;
      apiRequest = {
        url:requestOptions.server + path,
        method:'GET',
        json: {}
      },
      request(apiRequest, function(err, response, body){
        // console.log('sas');
        // console.log(body);
        // console.log(response);
        if(err){ throw err;}
        else {
          // console.log('sdsd');
          renderHomePage(req, res, body);
        }

      });
    }else {
      res.redirect('/signin',{layout:false});
    }
    //res.send('The home:index controller');

  },
};
