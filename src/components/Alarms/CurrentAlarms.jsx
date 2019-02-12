import React from "react";
import PropTypes from "prop-types";
import * as cn from "classnames";
import { displayLetterForDayOfWeek } from "../../utils";
import * as styles from "./CurrentAlarms.module.css";

const CurrentAlarms = ({
  alarms,
  removeAlarm,
  incrementPage,
  decrementPage,
  shouldRenderArrows
}) => (
  <div className={styles.alarms}>
    {shouldRenderArrows ? (
      <i
        className={cn("material-icons", styles.arrow)}
        onClick={() => decrementPage()}
      >
        arrow_back_ios
      </i>
    ) : null}
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
    {shouldRenderArrows ? (
      <i
        className={cn("material-icons", styles.arrow)}
        onClick={() => incrementPage()}
      >
        arrow_forward_ios
      </i>
    ) : null}
  </div>
);

CurrentAlarms.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAlarm: PropTypes.func.isRequired,
  incrementPage: PropTypes.func.isRequired,
  decrementPage: PropTypes.func.isRequired,
  shouldRenderArrows: PropTypes.bool.isRequired
};
export default CurrentAlarms;
