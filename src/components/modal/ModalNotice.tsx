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
    const { id, status } = reports.data[1];
    if (status !== "corrected") return;
    const lastNotifiedId = Number(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (lastNotifiedId === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, id.toString());
      return true;
    }
    return id !== lastNotifiedId;
  });

  if (!show) return null;

  return (
    <Modal
      className={`bg-neutral-white ${classes.container}`}
      close={() => setShow(false)}
    >
      <h2 className="text-large neutral-dark">Aviso</h2>
      <p className={`text-default neutral-darkgray`}>
        Foram adicionadas batidas às <time>23:59</time> de ontem e <time>00:00</time> de
        hoje, pois ontem o dia encerrou em atividade
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
