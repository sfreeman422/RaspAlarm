import React from "react";

export const Option = ({ userOption }) => (
  <div>
    <span>{userOption.friendlyName}</span>
    <span>
      <input
        type="checkbox"
        checked={userOption.showCelcius}
        onChange={() => setShowCelcius(!userOptions.showCelcius)}
      />
    </span>
  </div>;
);
