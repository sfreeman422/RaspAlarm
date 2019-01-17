import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";

const mapStateToProps = state => ({
  day: state.dateTime.today,
  date: state.dateTime.date,
  userLoc: state.location.userLoc
});

export const ConnectedToday = ({ day, date, userLoc }) => (
  <div className="today">
    <div className="weekday">
      <p id="dayAndLoc">
        {day}, {date}
        {userLoc !== "" ? <span> in {userLoc} </span> : null}
        <Link to="/settings">
          <i className="material-icons">settings</i>
        </Link>
      </p>
    </div>
  </div>
);

ConnectedToday.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  userLoc: PropTypes.string
};

ConnectedToday.defaultProps = {
  userLoc: ""
};

const Today = connect(mapStateToProps)(ConnectedToday);
export default Today;
