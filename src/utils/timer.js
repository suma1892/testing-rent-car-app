import {add, formatDistanceToNowStrict, isFuture, parseISO} from 'date-fns';
import {useEffect, useState} from 'react';

const Timer = dateTarget => {
  // const dummy = '2022-10-25T06:10:00.954922Z';
  const [seconds, setSeconds] = useState(0);
  const [minuteLeft, setMinuteLeft] = useState(0);
  const [secondLeft, setSecondLeft] = useState(0);

  useEffect(() => {
    if (!dateTarget) return;
    const deadline = add(parseISO(dateTarget), {minutes: 15});

    if (!isFuture(deadline)) return;

    const res = formatDistanceToNowStrict(deadline, {unit: 'second'});
    setSeconds(parseInt(res.split(' ')[0]));
  }, [dateTarget]);

  const timeHandler = seconds => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    setMinuteLeft(m);
    setSecondLeft(s);
  };

  useEffect(() => {
    timeHandler(seconds);

    if (seconds > 0) {
      const timerInterval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [seconds]);

  return {minuteLeft, secondLeft};
};

export default Timer;
