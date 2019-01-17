import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, hashHistory } from "react-router";
import { Provider } from "react-redux";
import store from "./store/store";

import Main from "./App";
import AlarmManager from "./components/AlarmManager";
import Settings from "./components/Settings";

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Main} />
      <Route path="/alarmManager" component={AlarmManager} />
      <Route path="/settings" component={Settings} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
