import { useState } from "react";

import Modal from "./Modal";

import { useClockContext } from "../../contexts/ClockContext";

import classes from "./ModalNotice.module.css";

const LOCAL_STORAGE_KEY = "lastReportNotified";

const ModalNotice = () => {
  const { reports } = useClockContext();

  const [show, setShow] = useState(() => {
    const lastReportNotified = localStorage.getItem(LOCAL_STORAGE_KEY);
    const { timestampId, hasAdjustment } = reports.data[1];
    if (!hasAdjustment) return false;
    if (!lastReportNotified) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        timestampId.toString(),
      );
      return true;
    }
    return Number(lastReportNotified) !== timestampId;
  });

  if (!show) return null;

  return (
    <Modal
      className={`bg-neutral-white ${classes.container}`}
      close={() => setShow(false)}
    >
      <h2 className="text-large neutral-dark">Aviso</h2>
      <p className={`text-default neutral-darkgray`}>
        Foram adicionadas batidas às 23:59 de ontem e 00:00 de hoje
      </p>
      <button
        className={`neutral-white bg-neutral-dark text-default`}
        onClick={() => setShow(false)}
      >
        ok
      </button>
    </Modal>
  );
};

export default ModalNotice;

