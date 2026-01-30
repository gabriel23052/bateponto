import { useState } from "react";

import CheckpointList from "../checkpoint/CheckpointList";
import ReportSum from "../report/ReportSum";
import ModalTitleBar from "./ModalTitleBar";
import CheckpointInput from "../checkpoint/CheckpointInput";
import Modal from "./Modal";
import SaveIcon from "../../assets/icons/save.svg?react";
import AlertIcon from "../../assets/icons/alert.svg?react";

import { useEditContext } from "../../contexts/EditContext";
import DateUtility from "../../utils/DateUtility";

import classes from "./ModalEdit.module.css";

/**
 * Exibe o modal de edição de relatórios
 */
const ModalEdit = () => {
  const [error, setError] = useState<null | string>(null);

  const { inEditionReport, hasEdited, cleanEditReport, save } =
    useEditContext();

  if (!inEditionReport) return null;

  return (
    <Modal
      className={`bg-neutral-white ${classes.container}`}
      close={cleanEditReport}
    >
      <ModalTitleBar closeModal={cleanEditReport}>
        {`Relatório do dia ${new Date(inEditionReport.id).toLocaleDateString("pt-br")}`}
      </ModalTitleBar>
      <div className={classes.reportInfo}>
        {inEditionReport.checkpoints.length === 0 ? (
          <p className={`neutral-lightgray text-default ${classes.noActivity}`}>
            Sem atividade
          </p>
        ) : (
          <CheckpointList
            checkpoints={inEditionReport.checkpoints}
            editMode={true}
          />
        )}
        <ReportSum
          sum={DateUtility.getSumView(inEditionReport.sum)}
          missingCheckpoint={inEditionReport.checkpoints.length % 2 !== 0}
        />
      </div>
      {error && (
        <p className={`negative-feedback text-small ${classes.error}`}>
          <AlertIcon width={16} height={16} />
          {error}
        </p>
      )}
      <div className={classes.controls}>
        <CheckpointInput setError={setError} />
        <button
          className={`text-default neutral-white bg-neutral-dark ${classes.saveButton}`}
          onClick={save}
          disabled={!hasEdited}
        >
          salvar
          <SaveIcon width={24} height={24} />
        </button>
      </div>
    </Modal>
  );
};

export default ModalEdit;

