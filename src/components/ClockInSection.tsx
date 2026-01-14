import classes from "./ClockInSection.module.css";

import PlayIcon from "../assets/icons/play.svg?react";
import StopIcon from "../assets/icons/stop.svg?react";

import { useActivityContext } from "../contexts/ActivityContext";

const ClockInSection = () => {
  const { inActivity, setInActivity } = useActivityContext();

  return (
    <section className={classes.container}>
      <button
        className={`neutral-white text-xlarge ${classes.button} ${
          inActivity ? classes.activity : ""
        }`}
        onClick={() => setInActivity((prev) => !prev)}
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
        Em atividade desde 22:21
      </p>
    </section>
  );
};

export default ClockInSection;
