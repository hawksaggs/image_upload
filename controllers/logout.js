module.exports = {
  index: function(req, res){
    console.log('sdd');
    // if(req.session.user){
      res.session.destroy();
      console.log(req);
      res.render('/signin',{layout:false});
    // }
  }
};
