import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

// Import the children
import Main from './components/Main.jsx';
import AlarmManager from './components/AlarmManager.jsx';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Main} />
    <Route path="/alarmManager" component={AlarmManager} />
  </Router>,
  document.getElementById('app'),
);
