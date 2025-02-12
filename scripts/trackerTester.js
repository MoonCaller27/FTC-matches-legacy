import React, { useState, useEffect } from 'react';
import { trackedEvent } from './tracker.js';

const ScheduleTracker = () => {
  const [schedule, setSchedule] = useState(null);
  const [results, setResults] = useState(null);
  const [teamSchedule, setTeamSchedule] = useState(null);
  const [teamId] = useState(7159);
  const [tracker, setTracker] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleData = await fetch('/testAllSchedule.json').then(response => response.json());
        const resultsData = await fetch('/testMatchResults.json').then(response => response.json());
        const teamScheduleData = await fetch('/testTeamSchedule.json').then(response => response.json());
        setSchedule(scheduleData);
        setResults(resultsData);
        setTeamSchedule(teamScheduleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (schedule && results && teamSchedule) {
      const eventTracker = new trackedEvent(schedule, results, teamId, teamSchedule);
      setTracker(eventTracker);  // Save the tracker object to state
    }
  }, [schedule, results, teamSchedule]);

  return (
    <div>
      <h1>Match Tracker</h1>
      {tracker ? (
        <div>
          <h2>Tracker Initialized</h2>
          <pre>{JSON.stringify(tracker, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading tracker...</p>
      )}
    </div>
  );
};

export default ScheduleTracker;
