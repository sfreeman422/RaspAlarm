import React from "react";

const DayOfWeek = ({ day, abbreviation, days, chooseDay, removeDay }) => (
  <h3
    className="unselectable dayOfWeek"
    id={days.includes(day) ? "selected" : "unselected"}
    onClick={() => {
      days.includes(day) ? removeDay(day) : chooseDay(day);
    }}
  >
    {abbreviation}
  </h3>
);

export default DayOfWeek;
