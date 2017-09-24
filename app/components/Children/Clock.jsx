import React from 'react';

const Clock = props => (
  <div className="col-xs-12 clock">
    <h1 className="time">{props.time}</h1>
  </div>
);

export default Clock;
