import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import * as styles from "./Today.module.css";

const mapStateToProps = state => ({
  day: state.dateTime.today,
  date: state.dateTime.date,
  userLoc: state.location.userLoc
});

export const ConnectedToday = ({ day, date, userLoc }) => (
  <p className={styles.today}>
    {`${day}, ${date} ${userLoc !== "" ? `in ${userLoc}` : ""}`}
    <Link to="/settings">
      <i className="material-icons">settings</i>
    </Link>
  </p>
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
