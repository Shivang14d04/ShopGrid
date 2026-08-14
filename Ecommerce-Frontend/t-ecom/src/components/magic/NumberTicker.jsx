import React from "react";

const NumberTicker = ({ value, prefix = "", suffix = "" }) => {
  return (
    <span className="font-semibold tabular-nums">
      {prefix}
      {Number(value).toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

export default NumberTicker;
