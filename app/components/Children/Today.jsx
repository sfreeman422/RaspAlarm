import React from 'react';

const Today = props => (
  <div className="today">
    <div className="col-xs-12 weekday">
      <p id="dayAndLoc">{props.day}, {props.date}</p>
      <p id="dayAndLoc">{props.userLoc !== undefined ? props.userLoc : null}</p>
    </div>
  </div>
  );

export default Today;
