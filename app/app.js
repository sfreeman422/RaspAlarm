var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
//Require the children
var Main = require('./components/Main');
var AlarmManager = require('./components/AlarmManager');

ReactDOM.render(
	<Main />,
	document.getElementById('app')
)
