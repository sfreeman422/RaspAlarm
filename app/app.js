import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Link, hashHistory} from 'react-router'

//Import the children
import Main from './components/Main'
import AlarmManager from './components/AlarmManager'

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Main}/>
		<Route path="/alarmManager" component={AlarmManager}/>
	</Router>,
	document.getElementById('app')
)
