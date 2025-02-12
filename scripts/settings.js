import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [refresh, setRefresh] = useState(30);
  const [status, setStatus] = useState('');
  useEffect(() => {
    chrome.storage.sync.get(
      {
        username: '',
        token: '',
        refresh: 30,
      },
      (items) => {
        setUsername(items.username);
        setToken(items.token);
        setRefresh(items.refresh);
      }
    );
  }, []);
  const save = () => {
    chrome.storage.sync.set(
      {
        username: username,
        token: token,
        refresh: refresh,
      },
      () => {
        setStatus('Saved!');
        setTimeout(() => {
          setStatus('');
        }, 1000);
      }
    );
  };

  return (
    <div>
      <h1>Settings</h1>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Token:
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </label>
      <br />
      <label>
        Refresh Interval:
        <input
          type="number"
          value={refresh}
          onChange={(e) => setRefresh(Number(e.target.value))}
        />
      </label>
      <br />
      <button onClick={save}>Save</button>
      {status && <p>{status}</p>}
    </div>
  );
};
export default Settings;
