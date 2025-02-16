
export function ThreeTeamMatch({ matchData, teamNumber, rankList }) {
  const [redScore, setRedScore] = useState(matchData.redScore);
  const [blueScore, setBlueScore] = useState(matchData.blueScore);
  const [status, setStatus] = useState(matchData.status);
  const containerRef = useRef(null);

  useEffect(() => {
    setRedScore(matchData.redScore);
    setBlueScore(matchData.blueScore);
    setStatus(matchData.status);
  }, [matchData]);

  useEffect(() => {
    const container = document.createElement("section");
    container.className = "match-container";

    const header = document.createElement("header");
    header.className = "match-header";

    const info = document.createElement("span");
    info.className = "info";
    info.textContent = matchData.description;
    header.appendChild(info);

    const redScoreSpan = document.createElement("span");
    redScoreSpan.className = `score ${redScore > blueScore ? "bold light-ftc-red" : "light-ftc-red"}`;
    redScoreSpan.textContent = redScore ?? "";
    header.appendChild(document.createElement("hr")).className = "divider";
    header.appendChild(redScoreSpan);

    const blueScoreSpan = document.createElement("span");
    blueScoreSpan.className = `score ${blueScore > redScore ? "bold light-ftc-blue" : "light-ftc-blue"}`;
    blueScoreSpan.textContent = blueScore ?? "";
    header.appendChild(document.createElement("hr")).className = "divider";
    header.appendChild(blueScoreSpan);

    header.appendChild(document.createElement("hr")).className = "divider";
    const statusSpan = document.createElement("span");
    statusSpan.className = "info";
    statusSpan.textContent = status;
    header.appendChild(statusSpan);

    container.appendChild(header);

    const matchStat = document.createElement("section");
    matchStat.className = "match-stat";

    [matchData.redTeamA, matchData.redTeamB, matchData.redTeamC, matchData.blueTeamA, matchData.blueTeamB, matchData.blueTeamC].forEach((team, index) => {
      const teamSpan = document.createElement("span");
      teamSpan.className = `team ${team.teamNumber === teamNumber ? "highlight" : ""} ${index < 3 ? "dark-ftc-red" : "dark-ftc-blue"}`;
      teamSpan.textContent = rankList[team.teamNumber] ? `#${rankList[team.teamNumber]} | ${team.teamName}` : team.teamName;
      matchStat.appendChild(teamSpan);
      if (index !== 5) {
        matchStat.appendChild(document.createElement("hr")).className = "divider";
      }
    });

    container.appendChild(matchStat);

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(container);
    }
  }, [redScore, blueScore, status, matchData, teamNumber, rankList]);

  return containerRef;
}
