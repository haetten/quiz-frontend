import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popup } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { timeConverter } from '../../utils';

const Countdown = ({ countdownTime, timeOver, setTimeTaken }) => {
  const totalTime = countdownTime * 1000;
  const [timerTime, setTimerTime] = useState(totalTime);
  const { hours, minutes, seconds } = timeConverter(timerTime);
  const [timeTaken, setTimeTakenLocal] = useState(0);
  const { hours: hoursTaken, minutes: minutesTaken, seconds: secondsTaken } = timeConverter(timeTaken);
  const [paused, setPaused] = useState(false);
  const [showTimeTaken, setShowTimeTaken] = useState(false || countdownTime === NaN);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused) {

        const newTime = timerTime - 1000;

        if (newTime >= 0) {
          setTimerTime(newTime);
        } else {
          clearInterval(timer);

          Swal.fire({
            icon: 'info',
            title: `Oops! Time's up.`,
            text: 'See how you did!',
            confirmButtonText: 'Check Results',
            timer: 5000,
            willClose: () => timeOver(totalTime - timerTime),
          });
        }
      }

    }, 1000);

    return () => {
      clearInterval(timer);
      const timeTaken_ = totalTime - timerTime + 1000;
      setTimeTakenLocal(timeTaken_);
      setTimeTaken(timeTaken_);
    };

    // eslint-disable-next-line
  }, [timerTime, paused]);

  return (
    <>
      <span style={{ float: 'right', width: 100 }}>
        <div>
        {showTimeTaken ? hoursTaken : hours}:
        {showTimeTaken ? minutesTaken : minutes}:
        {showTimeTaken ? secondsTaken : seconds}
        </div>
        <div>
          {showTimeTaken ? 'Time Taken' : 'Time Remaining'}
        </div>
      </span>

      <Icon
        name={!showTimeTaken ? "hourglass one" : "hourglass three"}
        onClick={() => setShowTimeTaken(!showTimeTaken)}
        style={{ cursor: 'pointer', float: 'right' }}
      />

      <Icon
        name={paused ? "play" : "pause"}
        onClick={() => setPaused(!paused)}
        style={{ cursor: 'pointer', float: 'right' }}
      />
    </>
  );
};

Countdown.propTypes = {
  countdownTime: PropTypes.number.isRequired,
  timeOver: PropTypes.func.isRequired,
  setTimeTaken: PropTypes.func.isRequired,
};

export default Countdown;
