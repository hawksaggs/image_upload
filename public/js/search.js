// var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//   'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
//   'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
//   'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
//   'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//   'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
//   'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
//   'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//   'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
// ];

var states = new Bloodhound({
  remote:{
    url:'/search?q=%QUERY%',
    wildcard:'%QUERY%'
  },
  datumTokenizer: Bloodhound.tokenizers.whitespace('q'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
});

// states.initialize();

$('#bloodhound .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  source: states.ttAdapter(),
  name: 'states',
  templates: {
		suggestion:function(data){console.log('sss');console.log(data);return '<div class="row" style="background-color:#fff;"><div class="col-md-3"><img src="cinqueterre.jpg" class="img- img-thumbnail" alt="Cinque Terre" width="304" height="236"></div><div class="col-md-9"><p>'+data.first_name+' '+data.last_name+'</p></div></div>'},

	     }
});
