// var token = window.localStorage.getItem('token');
// console.log(token);
// if(token){
//   $.ajaxSetup({
//     headers: {
//       'x-access-token':token
//     }
//   });
// }
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
$('.form').find('input, textarea').on('keyup blur focus', function (e) {

  var $this = $(this),
  label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if( $this.val() === '' ) {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {

    if( $this.val() === '' ) {
      label.removeClass('highlight');
    }
    else if( $this.val() !== '' ) {
      label.addClass('highlight');
    }
  }

});

$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

$('#login-submit').click(function(){
  var login = $('#login-form').serialize();
  $.ajax({
    url:'/login',
    type:'POST',
    data:login,
    success: function(result){
      // console.log(result.data);
      var data = (result);
      if(data['success']){
        // window.localStorage.setItem('token',data.data.token);
        setCookie('token',data.data.token,1);
        window.location.href = window.location.href+data['data']['username'][0];
      }else{
        $('#error-msg').show().text(data['message']).delay(2000).fadeOut("fast");
        // window.scrollTo(0,200);
      }
    }
  });
});
// $('#login-facebook').click(function(){
//   var login = $('#login-form').serialize();
//   $.ajax({
//     url:'/auth/facebook',
//     type:'POST',
//     data:login,
//     success: function(result){
//       var data = (result);
//       console.log(data);
//       if(data['success']){
//         window.location.href = window.location.href+data['data']['username'];
//       }else{
//         $('#error-msg').show().text(data['message']).delay(2000).fadeOut("fast");
//         // window.scrollTo(0,200);
//       }
//     }
//   });
// });

$('#signup-submit').click(function(){
  var signup = $('#signup-form').serialize();
  $.ajax({
    url:'/signin',
    type:'POST',
    data:signup,
  }).done(function(result){
    var data = result;
    if(data['success']){
      $('#success-msg').show().text(data['message']).delay(2000).fadeOut("fast");
      $('#signup-form')[0].reset();
      setTimeOut(function(){
        $('.tab-content > div').not('#login').hide();
        $('#login').fadeIn(600);
      },1000);

    }else{
      $('#error-msg').show().text(data['message']).delay(2000).fadeOut("fast");
    }
  });
});
