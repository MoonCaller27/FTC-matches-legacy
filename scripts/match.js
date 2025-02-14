export function TwoTeamMatch({ matchData, teamNumber, rankList }) {
  const [redScore, setRedScore] = useState(matchData.redScore);
  const [blueScore, setBlueScore] = useState(matchData.blueScore);
  const [status, setStatus] = useState(matchData.status);

  useEffect(() => {
    setRedScore(matchData.redScore);
    setBlueScore(matchData.blueScore);
    setStatus(matchData.status);
  }, [matchData]);

  const getTeamRank = (team) => {
    return rankList[team.teamNumber] ? `#${rankList[team.teamNumber]} | ${team.teamName}` : team.teamName;
  };

  const matchHeader = React.createElement(
    "div",
    { className: "match-header" },
    React.createElement("div", { className: "info" }, matchData.description),
    React.createElement("div", { className: "divider" }),
    React.createElement(
      "div",
      {
        className: `score ${redScore > blueScore ? "bold light-ftc-red" : "light-ftc-red"}`,
      },
      redScore ?? ""
    ),
    React.createElement("div", { className: "divider" }),
    React.createElement(
      "div",
      {
        className: `score ${blueScore > redScore ? "bold light-ftc-blue" : "light-ftc-blue"}`,
      },
      blueScore ?? ""
    ),
    React.createElement("div", { className: "divider" }),
    React.createElement("div", { className: "info" }, status)
  );

  const matchStat = React.createElement(
    "div",
    { className: "match-stat" },
    [matchData.redTeamA, matchData.redTeamB, matchData.blueTeamA, matchData.blueTeamB].map(
      (team, index) =>
        React.createElement(
          React.Fragment,
          { key: team.teamNumber },
          React.createElement(
            "div",
            {
              className: `team ${team.teamNumber === teamNumber ? "highlight" : ""} ${
                index < 2 ? "dark-ftc-red" : "dark-ftc-blue"
              }`,
            },
            getTeamRank(team)
          ),
          index !== 3 && React.createElement("div", { className: "divider" })
        )
    )
  );

  return React.createElement(
    "div",
    { className: "match-container" },
    matchHeader,
    matchStat
  );
}
