import React, { useState, useEffect } from 'react';
import { twoTeamMatch } from "./match.js";
import { threeTeamMatch } from "./3match.js";

const TrackedField = ({ fieldNumber, matchSchedule, resultData }) => {
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [lastMatch, setLastMatch] = useState(-1);

  useEffect(() => {
    build(fieldNumber, matchSchedule);
    updateMatchNumber(resultData);
  }, [fieldNumber, matchSchedule, resultData]);
  const build = (fieldNumber, matchSchedule) => {
    const fieldMatches = [];
    let ind = 0;

    matchSchedule.forEach((element) => {
      if (element.field === fieldNumber) {
        let orderedTeams = [];
        element.teams.forEach((team) => {
          if (team.station === 'Red1') orderedTeams[0] = team;
          else if (team.station === 'Red2') orderedTeams[1] = team;
          else if (team.station === 'Red3') orderedTeams[2] = team;
          else if (team.station === 'Blue1') orderedTeams[3] = team;
          else if (team.station === 'Blue2') orderedTeams[4] = team;
          else if (team.station === 'Blue3') orderedTeams[5] = team;
        });

        if (orderedTeams.length > 5) {
          fieldMatches[ind] = new threeTeamMatch(
            element.description,
            element.series,
            element.matchNumber,
            element.tournamentLevel,
            "Upcoming",
            fieldNumber,
            orderedTeams[0], orderedTeams[1], orderedTeams[2], null, // red
            orderedTeams[3], orderedTeams[4], orderedTeams[5], null  // blue
          );
        } else {
          fieldMatches[ind] = new twoTeamMatch(
            element.description,
            element.series,
            element.matchNumber,
            element.tournamentLevel,
            "Upcoming",
            fieldNumber,
            orderedTeams[0], orderedTeams[1], null, // red
            orderedTeams[3], orderedTeams[4], null  // blue
          );
        }
        ind++;
      }
    });
    setMatches(fieldMatches);
  };
  const updateMatchNumber = (matchResultData) => {
    let ind = 0;

    matchResultData.matches.forEach((result) => {
      if (result.description === matches[ind].description) {
        if (ind === matches.length - 1) {
          setCurrentMatch(-1);
        } else {
          setCurrentMatch(ind + 1);
        }

        setLastMatch(ind);
        matches[ind].setStatus("Completed");
        matches[ind].setScore(result.scoreRedFinal, result.scoreBlueFinal);
        ind++;
        if (ind >= matches.length) return;
      }
    });

    if (matches[ind]) {
      matches[ind].setStatus("In Progress");
    }
  };
  const compareMatch = (match) => {
    return matches.indexOf(match) - currentMatch;
  };

  const getStatusForMatch = (matchId) => {
    return matches.find((match) => match.description === matchId)?.status;
  };

  const getMatch = (matchId) => {
    return matches.find((match) => match.description === matchId);
  };

  return null;
};

const TrackedEvent = ({ matchSchedule, matchResultData, team, teamSchedule }) => {
  const [fields, setFields] = useState([]);
  const [fieldNumbers, setFieldNumbers] = useState([]);
  const [teamMatches, setTeamMatches] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    buildFields(matchSchedule, matchResultData);
    loadTeamMatches(teamSchedule, team);
  }, [matchSchedule, matchResultData, team, teamSchedule]);

  const buildFields = (matchSchedule, matchResultData) => {
    const newFields = [];
    const newFieldNumbers = [];

    matchSchedule.forEach((element) => {
      if (!newFieldNumbers.includes(element.field)) {
        newFields.push(
          <TrackedField
            key={element.field}
            fieldNumber={element.field}
            matchSchedule={matchSchedule}
            resultData={matchResultData}
          />
        );
        newFieldNumbers.push(element.field);
      }
    });

    setFields(newFields);
    setFieldNumbers(newFieldNumbers);
  };

  const loadTeamMatches = (teamSchedule, team) => {
    const newTeamMatches = [];

    teamSchedule.schedule.forEach((scheduleElement) => {
      const match = fields[fieldNumbers.indexOf(scheduleElement.field)].getMatch(scheduleElement.description);
      newTeamMatches.push(match);
      match.setTeam(team);
      match.createElements();
    });

    setTeamMatches(newTeamMatches);
  };

  const addElements = (scrollA, scrollB) => {
    teamMatches.forEach((match) => {
      scrollA.appendChild(match.getElementA());
      scrollB.appendChild(match.getElementB());
    });
  };

  const updateScoresAndStatus = (matchResultData) => {
    fields.forEach((field) => {
      field.updateMatchNumber(matchResultData);
    });
  };

  const updateRanks = (ranks) => {
    teamMatches.forEach((match) => {
      match.updateRankings(ranks);
    });
  };

  const isChanged = (allSchedule) => {
    let totalMatches = 0;
    fields.forEach((field) => {
      totalMatches += field.matches.length;
    });
    return totalMatches !== allSchedule.length;
  };

  const getNextNum = () => {
    let ret = {};
    if (teamMatches.length === 0) {
      ret[0] = -2;
      return ret;
    }

    for (let index = 0; index < teamMatches.length; index++) {
      const match = teamMatches[index];
      if (match.status === "In Progress") {
        ret[0] = 0;
        ret[1] = match;
        if (teamMatches[index + 1] !== null) {
          ret[2] = fields[fieldNumbers.indexOf(teamMatches[index + 1].field)].compareMatch(teamMatches[index + 1]);
          ret[3] = teamMatches[index + 1];
        } else {
          ret[2] = -1;
        }
        return ret;
      } else if (match.status === "Upcoming") {
        ret[0] = fields[fieldNumbers.indexOf(match.field)].compareMatch(match);
        ret[1] = match;
        return ret;
      }
    }

    ret[0] = -1;
    return ret;
  };

  return (
    <div>
      {/* Render field and team match elements here */}
    </div>
  );
};
export default TrackedEvent;
