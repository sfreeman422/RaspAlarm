var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var Alarm = require('./app/models/Alarms.js');

var app = express();
var PORT = process.env.PORT || 3000; 
mongoose.connect("mongodb://localhost:27017/alarms", function(){
	console.log("Connected to MongoDB on port 27017.");
});

app.use(logger('dev'));
app.use(bodyParser());
app.use(express.static('./public'));

//Initial route to load the page for the Timer, weather information, etc. 
app.get('/', function(req, res){
	res.sendFile('./public/index.html');
});
//Route to grab the set alarms from the mongoDB. 
app.get('/alarms', function(req, res){
	//Mongoose method to retrieve all 
	Alarm.find({}, function(err, docs){
		if(!err && docs){
			if(docs == []){
				res.send("No alarms available!");
			}
			else{
				console.log(typeof(docs));
				console.log(docs);
				res.send(docs);
			}
		}
		else{
			throw err;
		}
	});
});
//Route to set alarms. 
app.post('/setAlarm', function(req, res){
	console.log(req.body);
	res.redirect("/");
});
//Listen to the port.
app.listen(PORT, function(){
	console.log('listening on port '+PORT);
});