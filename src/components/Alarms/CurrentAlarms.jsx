import React from "react";
import PropTypes from "prop-types";
import { displayLetterForDayOfWeek } from "../../utils";

import * as styles from "./CurrentAlarms.module.css";

const cancelIcon = ["material-icons", styles.cancelAlarm].join(" ");

const CurrentAlarms = ({ alarms, removeAlarm }) => (
  <div className={styles.alarms}>
    {alarms.map((alarm, i) => (
      <div className={styles.alarm} key={`alarm-${i}`}>
        <h3 className={styles.alarmTime}>{alarm.time}</h3>
        <p className={styles.alarmDay}>
          {displayLetterForDayOfWeek(alarm.dayOfWeek)}
        </p>
        <i className={cancelIcon} onClick={() => removeAlarm(alarm._id)}>
          cancel
        </i>
      </div>
    ))}
  </div>
);

CurrentAlarms.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAlarm: PropTypes.func.isRequired
};
export default CurrentAlarms;
