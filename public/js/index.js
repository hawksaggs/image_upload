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
  // console.log(login);
  $.ajax({
    url:'/login',
    type:'POST',
    // dataType:'json',
    data:login,
  }).done(function(result){
    $('#error-msg').show().text(result.message);
    // $('#error-msg').text(result.message);
    // console.log(result);
  });
});

$('#signup-submit').click(function(){
  var signup = $('#signup-form').serialize();
  // console.log(signup);
  $.ajax({
    url:'/signin',
    type:'POST',
    // dataType:'json',
    data:signup,
  }).done(function(result){
    $('#success-msg').show().text(result.message);
    // $('#error-msg').text(result.message);
    // console.log(result);
  });
});
