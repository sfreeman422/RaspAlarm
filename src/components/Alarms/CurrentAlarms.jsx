import React from "react";
import PropTypes from "prop-types";
import * as cn from "classnames";
import { displayLetterForDayOfWeek } from "../../utils";
import * as styles from "./CurrentAlarms.module.css";

const CurrentAlarms = ({
  alarms,
  removeAlarm,
  incrementPage,
  decrementPage
}) => (
  <div className={styles.alarms}>
    <i
      className={cn("material-icons", styles.arrow)}
      onClick={() => decrementPage()}
    >
      arrow_back_ios
    </i>
    {alarms.map((alarm, i) => (
      <div className={styles.alarm} key={`alarm-${i}`}>
        <h3 className={styles.alarmTime}>{alarm.time}</h3>
        <p className={styles.alarmDay}>
          {displayLetterForDayOfWeek(alarm.dayOfWeek)}
        </p>
        <i
          className={cn("material-icons", styles.cancelAlarm)}
          onClick={() => removeAlarm(alarm._id)}
        >
          cancel
        </i>
      </div>
    ))}
    <i
      className={cn("material-icons", styles.arrow)}
      onClick={() => incrementPage()}
    >
      arrow_forward_ios
    </i>
  </div>
);

CurrentAlarms.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAlarm: PropTypes.func.isRequired,
  incrementPage: PropTypes.func.isRequired,
  decrementPage: PropTypes.func.isRequired
};
export default CurrentAlarms;
