import { useState } from "react";

import Modal from "./Modal";

import { useClockContext } from "../../contexts/ClockContext";

import classes from "./ModalNotice.module.css";

const LOCAL_STORAGE_KEY = "lastReportNotified";

/**
 * Exibe o modal de aviso
 */
const ModalNotice = () => {
  const { reports } = useClockContext();

  const [show, setShow] = useState(() => {
    const lastIdNotified = localStorage.getItem(LOCAL_STORAGE_KEY);
    const { id, hasAdjustment } = reports.data[1];
    if (!hasAdjustment) return false;
    if (!lastIdNotified) {
      localStorage.setItem(LOCAL_STORAGE_KEY, id.toString());
      return true;
    }
    return Number(lastIdNotified) !== id;
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

