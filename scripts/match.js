import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<FTCMatchOpener />, document.getElementById("root"));
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

  return (
    <div className="match-container">
      <div className="match-header">
        <div className="info">{matchData.description}</div>
        <div className="divider" />
        <div className={`score ${redScore > blueScore ? "bold light-ftc-red" : "light-ftc-red"}`}>{redScore ?? ""}</div>
        <div className="divider" />
        <div className={`score ${blueScore > redScore ? "bold light-ftc-blue" : "light-ftc-blue"}`}>{blueScore ?? ""}</div>
        <div className="divider" />
        <div className="info">{status}</div>
      </div>
      <div className="match-stat">
        {[matchData.redTeamA, matchData.redTeamB, matchData.blueTeamA, matchData.blueTeamB].map((team, index) => (
          <React.Fragment key={team.teamNumber}>
            <div className={`team ${team.teamNumber === teamNumber ? "highlight" : ""} ${index < 2 ? "dark-ftc-red" : "dark-ftc-blue"}`}>
              {getTeamRank(team)}
            </div>
            {index !== 3 && <div className="divider" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
