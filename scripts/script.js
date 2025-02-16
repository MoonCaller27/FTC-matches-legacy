import React, { useState, useEffect, useRef } from "react";

const FTCMatchTracker = ({ teamNumber, eventCode, teamName, eventName }) => {
  const [teamSchedule, setTeamSchedule] = useState([]);
  const [allSchedule, setAllSchedule] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [rankings, setRankings] = useState({});
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = `${teamNumber} - ${eventCode}`;
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        fetchAPI(`schedule/${eventCode}?teamNumber=${teamNumber}`),
        fetchAPI(`schedule/${eventCode}?tournamentLevel=qual`),
        fetchAPI(`schedule/${eventCode}?tournamentLevel=playoff`),
        fetchAPI(`matches/${eventCode}`),
        fetchAPI(`rankings/${eventCode}`)
      ]);

      if (responses.includes(null)) {
        setError(true);
        return;
      }

      setError(false);
      setTeamSchedule(responses[0]);
      setAllSchedule([...responses[1].schedule, ...responses[2].schedule]);
      setAllResults(responses[3]);
      setRankings(responses[4].rankings.reduce((acc, el) => ({ ...acc, [el.teamNumber]: el.rank }), {}));
    } catch {
      setError(true);
    }
  };

  const fetchAPI = async (endpoint) => {
    try {
      const response = await fetch(`https://ftc-api.firstinspires.org/v2.0/2024/${endpoint}`);
      return await response.json();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const container = document.createElement("section");
    container.appendChild(createHeader(`${teamNumber} - ${teamName}`, "h1"));
    container.appendChild(createHeader(eventName, "h2"));
    container.appendChild(createMessage());

    const scrollContainerA = document.createElement("section");
    scrollContainerA.id = "scroll-container-a";
    
    const scrollContainerB = document.createElement("section");
    scrollContainerB.id = "scroll-container-b";
    
    container.appendChild(scrollContainerA);
    container.appendChild(scrollContainerB);

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(container);
    }
  }, [teamSchedule, allSchedule, allResults, rankings, error]);

  const createHeader = (text, tag) => {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  };

  const createMessage = () => {
    const message = document.createElement("p");
    message.textContent = error ? "Error fetching data" : "Data loaded successfully";
    return message;
  };

  return containerRef;
};

export default FTCMatchTracker;
