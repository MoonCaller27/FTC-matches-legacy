import { useEffect, useState } from "react";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [refresh, setRefresh] = useState(30);
  const [status, setStatus] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(
      {
        username: "",
        token: "",
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
        username,
        token,
        refresh,
      },
      () => {
        setStatus("Saved!");
        setTimeout(() => {
          setStatus("");
        }, 1000);
      }
    );
  };

  const container = document.createElement("div");
  
  const title = document.createElement("h1");
  title.textContent = "Settings";
  container.appendChild(title);
  
  const createInput = (labelText, value, onChange, type = "text") => {
    const label = document.createElement("label");
    label.textContent = labelText;
    
    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.oninput = (e) => onChange(e.target.value);
    
    label.appendChild(input);
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  };
  
  createInput("Username:", username, setUsername);
  createInput("Token:", token, setToken);
  createInput("Refresh Interval:", refresh, (val) => setRefresh(Number(val)), "number");
  
  const button = document.createElement("button");
  button.textContent = "Save";
  button.onclick = save;
  container.appendChild(button);
  
  if (status) {
    const statusElem = document.createElement("p");
    statusElem.textContent = status;
    container.appendChild(statusElem);
  }

  return container;
};

export default Settings;
