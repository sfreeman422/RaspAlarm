var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
//Require the children
var Main = require('./components/Main');
var AlarmManager = require('./components/AlarmManager');

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Main}/>
		<Route path="/alarmManager" component={AlarmManager}/>
	</Router>,
	document.getElementById('app')
)
