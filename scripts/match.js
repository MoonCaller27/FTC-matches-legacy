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

  const container = document.createElement("div");
  container.className = "match-container";

  const matchHeader = document.createElement("div");
  matchHeader.className = "match-header";

  const info1 = document.createElement("span");
  info1.className = "info";
  info1.textContent = matchData.description;

  const divider1 = document.createElement("span");
  divider1.className = "divider";

  const redScoreElem = document.createElement("span");
  redScoreElem.className = `score ${redScore > blueScore ? "bold light-ftc-red" : "light-ftc-red"}`;
  redScoreElem.textContent = redScore ?? "";

  const divider2 = document.createElement("span");
  divider2.className = "divider";

  const blueScoreElem = document.createElement("span");
  blueScoreElem.className = `score ${blueScore > redScore ? "bold light-ftc-blue" : "light-ftc-blue"}`;
  blueScoreElem.textContent = blueScore ?? "";

  const divider3 = document.createElement("span");
  divider3.className = "divider";

  const info2 = document.createElement("span");
  info2.className = "info";
  info2.textContent = status;

  matchHeader.append(info1, divider1, redScoreElem, divider2, blueScoreElem, divider3, info2);
  container.appendChild(matchHeader);

  const matchStat = document.createElement("div");
  matchStat.className = "match-stat";

  [matchData.redTeamA, matchData.redTeamB, matchData.blueTeamA, matchData.blueTeamB].forEach((team, index) => {
    const teamElement = document.createElement("span");
    teamElement.className = `team ${team.teamNumber === teamNumber ? "highlight" : ""} ${index < 2 ? "dark-ftc-red" : "dark-ftc-blue"}`;
    teamElement.textContent = getTeamRank(team);

    matchStat.appendChild(teamElement);
    if (index !== 3) {
      const divider = document.createElement("span");
      divider.className = "divider";
      matchStat.appendChild(divider);
    }
  });

  container.appendChild(matchStat);
  return container;
}
