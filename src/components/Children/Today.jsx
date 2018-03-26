import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  day: state.today,
  date: state.date,
  userLoc: state.userLoc,
});
const ConnectedToday = ({ day, date, userLoc }) => (
  <div className="today">
    <div className="weekday">
      <p id="dayAndLoc">{day}, {date} {userLoc !== '' ? ` in ${userLoc}` : null}</p>
    </div>
  </div>
);

const Today = connect(mapStateToProps)(ConnectedToday);
export default Today;
