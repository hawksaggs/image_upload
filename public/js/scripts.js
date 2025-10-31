$(document).ready(function(){

	$(".nav-tabs a").click(function(){
		// var tab = this.href;
		// tab = tab.split('#');
		// $('.tab-content > div:last-child').show();
        $(this).tab('show');
    });

	$('#post-comment').hide();

	$('#btncomment').on('click', function(event){
		event.preventDefault();

		$('#post-comment').show();
	});

	$('#btn-like').on('click', function(event){
		event.preventDefault();

		var imgId = $(this).attr('dataid');

		$.post('/images/' + imgId + '/like').done(function(data){
			$('.likes-count').text(data.likes);
		});
	});

	// $('#btn-delete').on('click', function(event){
	// 	event.preventDefault();
	// 	var $this = $(this);
  //
	// 	var remove = confirm('Are you sure you want to delete this image?');
	// 	if(remove){
	// 		var imgId = $(this).data('id');
	// 		$.ajax({
	// 			url: '/images/' + imgId,
	// 			type: 'DELETE'
	// 		}).done(function(result){
  //
	// 			if(result){
	// 				$this.removeClass('btn-danger').addClass('btn-success');
	// 				$this.find('i').removeClass('fa-times').addClass('fa-check');
	// 				$this.append('<span> Deleted! </span>');
	// 			}
	// 		});
	// 	}
	// });
	// $('#logout').click(function(){
	// 	var data = "session_destroy=true";
	//   $.ajax({
	//     url:'/signout',
	//     type:'GET',
	//     data:data,
	//     success:function(data){
	//       console.log(data);
	//     }
	//
	//   });
	// });
	$('.img-circle').click(function(){
	  $('#profile_picture').trigger('click');
	});

	$('#profile_picture').on('change',function(){
	  console.log((this.files));
		// $.ajax({
		// 	url:'/profile_picture',
		// 	data:,
		// 	method:'POST',
		// 	success:function(response){
		// 		console.log(response);
		// 	}
		// });
		$('#profile').submit();
		
	});
});
