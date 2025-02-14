import React from "react";

export function FTCMatchOpener() {
  const regex = /^[0-9]+$/;

  const openSite = async () => {
    // Get input values
    const teamInput = document.getElementById("teamInput").value.trim();
    const codeInput = document.getElementById("codeInput").value.trim();
    const teamErr = document.getElementById("teamErr");
    const codeErr = document.getElementById("codeErr");

    // Clear previous errors
    teamErr.textContent = "";
    codeErr.textContent = "";
    let bad = false;

    // Validate team number
    if (teamInput === "") {
      bad = true;
      teamErr.textContent = "Team number is blank.";
    } else if (!regex.test(teamInput)) {
      bad = true;
      teamErr.textContent = "Team number is not a number.";
    }

    // Validate event code
    if (codeInput === "") {
      bad = true;
      codeErr.textContent = "Event code is blank.";
    }

    if (!bad) {
      try {
        const event = await chrome.runtime.sendMessage({
          url: `https://ftc-api.firstinspires.org/v2.0/2024/events?eventCode=${codeInput}`,
        });
        const tm = await chrome.runtime.sendMessage({
          url: `https://ftc-api.firstinspires.org/v2.0/2024/teams?teamNumber=${teamInput}`,
        });

        if (tm.error) {
          bad = true;
          teamErr.textContent = tm.error === "400" ? "Invalid team number" : `An unknown error occurred: ${tm.error}`;
        }

        if (event.error) {
          bad = true;
          codeErr.textContent = event.error === "404" ? "Invalid event code" : `An unknown error occurred: ${event.error}`;
        }

        if (!bad) {
          const wind = window.open("/index.html", "", "popup");
          wind.num = teamInput;
          wind.teamName = tm.teams[0].nameShort;
          wind.evCode = codeInput;
          wind.evName = event.events[0].name;
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };

  return (
    <div>
      <input type="text" id="teamInput" placeholder="Team Number" />
      <span id="teamErr" style={{ color: "red" }}></span>

      <input type="text" id="codeInput" placeholder="Event Code" />
      <span id="codeErr" style={{ color: "red" }}></span>

      <button onClick={openSite}>Submit</button>
    </div>
  );
}
