import React, { useState, useEffect } from "react";

const API_USERNAME = "karsteny";
const API_KEY = "3298DEAE-A59D-487C-8092-3C4B1C63ECE3";
const API_AUTH = "Basic " + btoa(`${API_USERNAME}:${API_KEY}`);

async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        authorization: API_AUTH
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

export function FTCSchedule({ teamNumber, eventCode }) {
  const [schedule, setSchedule] = useState(null);
  const [rankings, setRankings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      const scheduleUrl = `https://ftc-api.firstinspires.org/v2.0/2023/schedule/${eventCode}?teamNumber=${teamNumber}`;
      const rankingsUrl = `https://ftc-api.firstinspires.org/v2.0/2023/rankings/${eventCode}`;

      const [scheduleData, rankingsData] = await Promise.all([
        fetchData(scheduleUrl),
        fetchData(rankingsUrl)
      ]);

      if (scheduleData.error || rankingsData.error) {
        setError(scheduleData.error || rankingsData.error);
      } else {
        setSchedule(scheduleData);
        setRankings(rankingsData);
      }
    }

    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, [teamNumber, eventCode]);

  if (error) return <div>Error: {error}</div>;
  if (!schedule || !rankings) return <div>Loading...</div>;

  return (
    <div>
      <h2>Team {teamNumber} Schedule</h2>
      <pre>{JSON.stringify(schedule, null, 2)}</pre>
      <h2>Rankings</h2>
      <pre>{JSON.stringify(rankings, null, 2)}</pre>
    </div>
  );
}
