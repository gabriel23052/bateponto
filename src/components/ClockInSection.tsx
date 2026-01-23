import { useClockContext } from "../contexts/ClockContext";

import DateUtility from "../utils/DateUtility";

import PlayIcon from "../assets/icons/play.svg?react";
import StopIcon from "../assets/icons/stop.svg?react";

import classes from "./ClockInSection.module.css";


/**
 * Componente que exibe o botão de batida e o status
 */
const ClockInSection = () => {
  const { addCheckpoint, inActivity, reports } = useClockContext();

  const getLastCheckpoint = () => {
    return DateUtility.getTimeView(
      reports.data[0].checkpoints[reports.data[0].checkpoints.length - 1] || 0,
    );
  };

  return (
    <section className={classes.container}>
      <button
        className={`neutral-white text-xlarge ${classes.button} ${
          inActivity ? classes.activity : ""
        }`}
        onClick={addCheckpoint}
      >
        {inActivity ? (
          <>
            parar
            <StopIcon width={22} height={22} />
          </>
        ) : (
          <>
            iniciar
            <PlayIcon width={20} height={25} />
          </>
        )}
      </button>
      <p
        className={`primary-large activity ${classes.status}`}
        style={{
          top: inActivity ? "calc(100% + var(--px8))" : "0px",
        }}
      >
        Em atividade desde {getLastCheckpoint()}
      </p>
    </section>
  );
};

export default ClockInSection;
