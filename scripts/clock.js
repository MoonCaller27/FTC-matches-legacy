const DigitalClock = () => {
  const [digits, setDigits] = useState(["0", "0", "0", "0", "0", "0"]);
  const [colors, setColors] = useState(Array(6).fill("#ffc800"));

  useEffect(() => {
    const updateClock = () => {
      let d = new Date();
      let hour = d.getHours();
      let min = d.getMinutes();
      let sec = d.getSeconds();

      if (min < 10) min = "0" + min;
      if (sec < 10) sec = "0" + sec;
      if (hour > 12) {
        hour -= 12;
      } else if (hour === 0) hour = 12;

      const newDigits = [
        Math.trunc(hour / 10).toString(),
        (hour % 10).toString(),
        Math.trunc(min / 10).toString(),
        (min % 10).toString(),
        Math.trunc(sec / 10).toString(),
        (sec % 10).toString(),
      ];

      setColors((prevColors) =>
        prevColors.map((color, index) => (digits[index] !== newDigits[index] ? "#000000" : color))
      );

      setTimeout(() => {
        setDigits(newDigits);
        setColors(Array(6).fill("#ffc800"));
      }, 150);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [digits]);

  const container = document.createElement("div");
  container.id = "dt";
  container.style.display = "flex";
  container.style.fontSize = "2rem";

  digits.forEach((digit, index) => {
    const span = document.createElement("span");
    span.style.color = colors[index];
    span.style.margin = "0 5px";
    span.textContent = digit;
    container.appendChild(span);
  });

  return container;
};

export default DigitalClock;
