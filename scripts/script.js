const FTCMatchTracker = ({ teamNumber, eventCode, teamName, eventName }) => {
  const [teamSchedule, setTeamSchedule] = useState([]);
  const [allSchedule, setAllSchedule] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [rankings, setRankings] = useState({});
  const [error, setError] = useState(false);
  const [lastVal, setLastVal] = useState(-5);

  const scrollARef = useRef(null);
  const scrollBRef = useRef(null);

  useEffect(() => {
    document.title = `${teamNumber} - ${eventCode}`;
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const teamScheduleRes = await fetchAPI(`schedule/${eventCode}?teamNumber=${teamNumber}`);
      const qualScheduleRes = await fetchAPI(`schedule/${eventCode}?tournamentLevel=qual`);
      const playoffScheduleRes = await fetchAPI(`schedule/${eventCode}?tournamentLevel=playoff`);
      const resultsRes = await fetchAPI(`matches/${eventCode}`);
      const rankingsRes = await fetchAPI(`rankings/${eventCode}`);

      if (!teamScheduleRes || !qualScheduleRes || !playoffScheduleRes || !resultsRes || !rankingsRes) {
        setError(true);
        return;
      }

      setError(false);
      setTeamSchedule(teamScheduleRes);
      setAllSchedule([...qualScheduleRes.schedule, ...playoffScheduleRes.schedule]);
      setAllResults(resultsRes);
      setRankings(rankingsRes.rankings.reduce((acc, el) => ({ ...acc, [el.teamNumber]: el.rank }), {}));
    } catch (err) {
      setError(true);
    }
  };

  const fetchAPI = async (endpoint) => {
    try {
      const response = await fetch(`https://ftc-api.firstinspires.org/v2.0/2024/${endpoint}`);
      return await response.json();
    } catch (err) {
      return null;
    }
  };

  const updateScroll = () => {
    if (scrollARef.current && scrollBRef.current) {
      if (scrollARef.current.offsetHeight > 500) {
        scrollARef.current.animate(
          { top: ["0em", `-${scrollARef.current.offsetHeight}px`] },
          { duration: scrollARef.current.offsetHeight * 27, easing: "linear", iterations: Infinity }
        );
        scrollBRef.current.style.display = "block";
      } else {
        scrollBRef.current.style.display = "none";
      }
    }
  };

  useEffect(() => {
    updateScroll();
  }, [teamSchedule, allSchedule, allResults, rankings]);

  // Using document.createElement for rendering  
  useEffect(() => {
    const container = document.createElement('div');
    container.appendChild(createHeader(`${teamNumber} - ${teamName}`, 'h1'));
    container.appendChild(createHeader(eventName, 'h2'));
    container.appendChild(createMessage());
    
    const scrollContainerA = document.createElement('div');
    scrollContainerA.id = 'scroll-container-a';
    scrollContainerA.ref = scrollARef;

    const scrollContainerB = document.createElement('div');
    scrollContainerB.id = 'scroll-container-b';
    scrollContainerB.ref = scrollBRef;

    container.appendChild(scrollContainerA);
    container.appendChild(scrollContainerB);

    const currentContainer = document.getElementById('match-tracker-container');
    if (currentContainer) {
      // Clear previous content  
      currentContainer.innerHTML = '';
      currentContainer.appendChild(container);
    }

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = ''; 
      }
    };
  }, [teamSchedule, allSchedule, allResults, rankings, error]); 
  const createHeader = (text, tag) => {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  };

  const createMessage = () => {
    const message = document.createElement('p');
    message.textContent = error ? 'Error fetching data' : 'Data loaded successfully';
    return message;
  };

  return <div id="match-tracker-container"></div>;
};

export default FTCMatchTracker;
