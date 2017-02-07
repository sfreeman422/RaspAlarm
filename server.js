var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var app = express();
var PORT = process.env.PORT || 3000; 
mongoose.connect("mongodb://localhost:27017", function(){
	console.log("Connected to MongoDB on port 27017.");
});

app.use(logger('dev'));
app.use(express.static('./public'));

//Initial route to load the page for the Timer, weather information, etc. 
app.get('/', function(req, res){
	res.sendFile('./public/index.html');
});

app.listen(PORT, function(){
	console.log('listening on port '+PORT);
});