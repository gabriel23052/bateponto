import { useEffect, useRef, useState } from "react";

import PlayIcon from "../../assets/icons/play.svg?react";
import StopIcon from "../../assets/icons/stop.svg?react";

import { useClockContext } from "../../contexts/ClockContext";
import DateUtility from "../../utils/DateUtility";

import classes from "./CheckpointButton.module.css";

const CHECKPOINT_DELAY = 5000;

/**
 * Exibe o botão de batida e o status atual
 */
const CheckpointButton = () => {
  const [blocked, setBlocked] = useState(false);

  const { addCheckpoint, inActivity, reports } = useClockContext();

  const blockTimeout = useRef<number | null>(null);

  const getLastCheckpoint = () => {
    return DateUtility.getTimeView(
      reports.data[0].checkpoints[reports.data[0].checkpoints.length - 1] || 0,
    );
  };

  const handleClick = () => {
    setBlocked(true);
    addCheckpoint();
    blockTimeout.current = setTimeout(() => {
      setBlocked(false);
    }, CHECKPOINT_DELAY);
  };

  useEffect(() => {
    return () => {
      if (blockTimeout.current) {
        clearTimeout(blockTimeout.current);
        blockTimeout.current = null;
      }
    };
  }, []);

  return (
    <section className={classes.container}>
      <button
        className={`neutral-white text-xlarge ${classes.button} ${
          inActivity ? classes.activity : ""
        }`}
        onClick={handleClick}
        disabled={blocked}
      >
        {inActivity ? (
          <>
            parar
            <StopIcon width={22} height={22} aria-hidden="true" />
          </>
        ) : (
          <>
            iniciar
            <PlayIcon width={20} height={25} aria-hidden="true" />
          </>
        )}
      </button>
      <p
        className={`primary-large activity ${classes.status}`}
        style={{
          top: inActivity ? "calc(100% + var(--px8))" : "0px",
        }}
        aria-hidden={!inActivity}
      >
        Em atividade desde <time>{getLastCheckpoint()}</time>
      </p>
    </section>
  );
};

export default CheckpointButton;
