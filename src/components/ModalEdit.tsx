import ModalBase from "./ModalBase";
import CheckpointList from "./CheckpointList";
import ReportSum from "./ReportSum";
import ModalWindow from "./ModalWindow";
import PrimaryButton from "./PrimaryButton";

import { useEditContext } from "../contexts/EditContext";
import DateUtility from "../utils/DateUtility";

import TrashIcon from "../assets/icons/trash.svg?react";

import classes from "./ModalEdit.module.css";

const ModalEdit = () => {
  const { inEditionReport, cleanEditReport, eraseAllCheckpoints, save } =
    useEditContext();

  if (!inEditionReport) return null;
  return (
    <ModalBase closeModal={cleanEditReport}>
      <ModalWindow
        title={new Date(inEditionReport.timestampId).toLocaleDateString(
          "pt-br",
        )}
        closeModal={cleanEditReport}
      >
        <div className={`bg-neutral-white ${classes.container}`}>
          <div className={classes.edition}>
            <CheckpointList
              checkpoints={inEditionReport.checkpoints}
              editMode={true}
            />
            <ReportSum
              sum={DateUtility.getSumView(inEditionReport.sum)}
              missingCheckpoint={inEditionReport.checkpoints.length % 2 !== 0}
            />
          </div>
          <div className={classes.controls}>
            <p className="text-small neutral-lightgray">
              Os horários são ordenados automáticamente
            </p>
            <button
              className={`bg-negative-feedback ${classes.trashButton}`}
              onClick={eraseAllCheckpoints}
              title="Apagar todas as batidas"
            >
              <TrashIcon width={16} height={18} />
            </button>
            <PrimaryButton onClick={save}>SALVAR</PrimaryButton>
          </div>
        </div>
      </ModalWindow>
    </ModalBase>
  );
};

export default ModalEdit;

