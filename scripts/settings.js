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

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Settings'),
    React.createElement(
      'label',
      null,
      'Username:',
      React.createElement('input', {
        type: 'text',
        value: username,
        onChange: (e) => setUsername(e.target.value),
      })
    ),
    React.createElement('br', null),
    React.createElement(
      'label',
      null,
      'Token:',
      React.createElement('input', {
        type: 'text',
        value: token,
        onChange: (e) => setToken(e.target.value),
      })
    ),
    React.createElement('br', null),
    React.createElement(
      'label',
      null,
      'Refresh Interval:',
      React.createElement('input', {
        type: 'number',
        value: refresh,
        onChange: (e) => setRefresh(Number(e.target.value)),
      })
    ),
    React.createElement('br', null),
    React.createElement(
      'button',
      { onClick: save },
      'Save'
    ),
    status && React.createElement('p', null, status)
  );
};

export default Settings;
