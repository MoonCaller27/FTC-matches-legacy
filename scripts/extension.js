import React, { useState } from "react";

export function FTCMatchOpener() {
  const [team, setTeam] = useState("");
  const [code, setCode] = useState("");
  const [teamErr, setTeamErr] = useState("");
  const [codeErr, setCodeErr] = useState("");
  const regex = /^[0-9]+$/;

  const openSite = async () => {
    setTeamErr("");
    setCodeErr("");
    let bad = false;

    if (team.trim() === "") {
      bad = true;
      setTeamErr("Team number is blank.");
    } else if (!regex.test(team)) {
      bad = true;
      setTeamErr("Team number is not a number.");
    }

    if (code.trim() === "") {
      bad = true;
      setCodeErr("Event code is blank.");
    }

    if (!bad) {
      try {
        const event = await chrome.runtime.sendMessage({
          url: `https://ftc-api.firstinspires.org/v2.0/2023/events?eventCode=${code.trim()}`,
        });
        const tm = await chrome.runtime.sendMessage({
          url: `https://ftc-api.firstinspires.org/v2.0/2023/teams?teamNumber=${team.trim()}`,
        });

        if (tm.error) {
          bad = true;
          setTeamErr(tm.error === "400" ? "Invalid team number" : `An unknown error occurred: ${tm.error}`);
        }

        if (event.error) {
          bad = true;
          setCodeErr(event.error === "404" ? "Invalid event code" : `An unknown error occurred: ${event.error}`);
        }

        if (!bad) {
          const wind = window.open("/index.html", "", "popup");
          wind.num = team.trim();
          wind.teamName = tm.teams[0].nameShort;
          wind.evCode = code.trim();
          wind.evName = event.events[0].name;
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };

  return (
    <div>
      <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team Number" />
      <span>{teamErr}</span>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Event Code" />
      <span>{codeErr}</span>
      <button onClick={openSite}>Submit</button>
    </div>
  );
}
