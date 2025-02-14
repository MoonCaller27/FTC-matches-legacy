import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<FTCMatchOpener />, document.getElementById("root"));
export function DivWithClassAndText({ className, text }) {
  return <div className={className}>{text}</div>;
}


export function TeamDiv({ colorClass, teamNumber, teamName, isBold }) {
  return (
    <div className={`${colorClass} team`}>
      <span className={isBold ? "bold" : ""}>{teamNumber}</span>
      <DivWithClassAndText className="team-name" text={teamName} />
    </div>
  );
}

export function Divider() {
  return <div className="divider"></div>;
}
