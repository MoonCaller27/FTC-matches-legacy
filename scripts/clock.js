import { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
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

  return (
    <div id="dt" style={{ display: "flex", fontSize: "2rem" }}>
      {digits.map((digit, index) => (
        <span key={index} style={{ color: colors[index], margin: "0 5px" }}>
          {digit}
        </span>
      ))}
    </div>
  );
};

export default DigitalClock;
