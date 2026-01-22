import { useEffect, useRef, useState } from "react";

import PlayIcon from "../assets/icons/play.svg?react";
import StopIcon from "../assets/icons/stop.svg?react";
import ModalNotice from "./ModalNotice";

import { useClockContext } from "../contexts/ClockContext";

import classes from "./ClockInSection.module.css";

const BLOCK_TIMESTAMP_STORAGE_KEY = "blockedUntil";

/**
 * Componente que exibe o botão de batida e o status
 */
const ClockInSection = () => {
  const { addCheckpoint, inActivity, reports } = useClockContext();

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [blocked, setBlocked] = useState(() => {
    return (
      Number(localStorage.getItem(BLOCK_TIMESTAMP_STORAGE_KEY) || 0) >=
      new Date().getTime()
    );
  });

  const timeout = useRef<number | null>(null);

  const setupTimeout = () => {
    const now = new Date();
    const blockedUntil = Number(
      localStorage.getItem(BLOCK_TIMESTAMP_STORAGE_KEY) || 0,
    );
    const difference = blockedUntil - now.getTime();
    if (difference > 0) {
      timeout.current = setTimeout(() => {
        setBlocked(false);
      }, difference);
    }
  };

  useEffect(() => {
    setupTimeout();
    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (blocked) {
      setShowNoticeModal(true);
      return;
    }
    if (!inActivity) {
      setBlocked(true);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1, 0, 0);
      const blockTimestamp = now.getTime();
      localStorage.setItem(
        BLOCK_TIMESTAMP_STORAGE_KEY,
        blockTimestamp.toString(),
      );
      setupTimeout();
    }
    addCheckpoint();
  };

  const getLastCheckpoint = () => {
    const lastCheckpoint =
      reports.data[0].checkpoints[reports.data[0].checkpoints.length - 1];
    return lastCheckpoint ? lastCheckpoint[0] : null;
  };

  const closeModal = () => {
    setShowNoticeModal(false);
  };

  return (
    <section className={classes.container}>
      {showNoticeModal && (
        <ModalNotice closeModal={closeModal}>
          Ops! Parece que você já bateu o ponto às{" "}
          {getLastCheckpoint() || "00:00"}, para bater novamente aguarde o
          minuto virar.
        </ModalNotice>
      )}
      <button
        className={`neutral-white text-xlarge ${classes.button} ${
          inActivity ? classes.activity : ""
        }`}
        onClick={handleClick}
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
