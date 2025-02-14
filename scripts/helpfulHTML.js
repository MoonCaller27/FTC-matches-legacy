export function DivWithClassAndText({ className, text }) {
  return React.createElement("div", { className: className }, text);
}

export function TeamDiv({ colorClass, teamNumber, teamName, isBold }) {
  return React.createElement(
    "div",
    { className: `${colorClass} team` },
    React.createElement(
      "span",
      { className: isBold ? "bold" : "" },
      teamNumber
    ),
    React.createElement(DivWithClassAndText, { className: "team-name", text: teamName })
  );
}

export function Divider() {
  return React.createElement("div", { className: "divider" });
}
