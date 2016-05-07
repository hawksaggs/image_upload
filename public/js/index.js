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
  console.log(document.domain);
  console.log(window.location);
  console.log(window.location.href);
  $.ajax({
    url:'/login',
    type:'POST',
    data:login,
  }).done(function(result){
    var data = (result);
    console.log(result);
    if(data['success']){
      $('#error-msg').hide();
      window.location.href = window.location.href+data['data']['username'];

    }else{
        $('#error-msg').show().text(data['message']);
    }
  });
});

$('#signup-submit').click(function(){
  var signup = $('#signup-form').serialize();
  $.ajax({
    url:'/signin',
    type:'POST',
    data:signup,
  }).done(function(result){
    // console.log(result);
    var data = result;
    if(data['success']){
        $('#success-msg').show().text(data['message']);
        $('#error-msg').hide();
    }else{
        $('#error-msg').show().text(data['message']);
        $('#success-msg').hide();
    }
  });
});
