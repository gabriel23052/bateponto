import { useState } from "react";

import classes from "./ClockInButton.module.css";

import PlayIcon from "../assets/icons/play.svg?react";
import StopIcon from "../assets/icons/stop.svg?react";

const ClockInButton = () => {
  const [inActivity, setInActivity] = useState(false);

  return (
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
  );
};

export default ClockInButton;
