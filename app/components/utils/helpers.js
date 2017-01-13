//Server-side Ajax Calls
var axios = require('axios');

var weatherKey = "a1fdaf6002affae9c9357ffa9a25e0df"
var Helpers = {
getWeatherToday: function (){
	var lat = 40.3542329; 
	var long = -74.6127537;
	axios.get("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&APPID="+weatherKey)
	.then(function(response){
		console.log(response); 
		console.log("What I wanna See: "+response.data.weather[0].main);
		return response.data.weather[0].main;
	});
}
}


module.exports = Helpers; 
