import ModalBase from "./ModalBase";
import CheckpointList from "./CheckpointList";
import ReportSum from "./ReportSum";
import ModalWindow from "./ModalWindow";
import PrimaryButton from "./PrimaryButton";
import CheckpointInput from "./CheckpointInput";

import { useEditContext } from "../contexts/EditContext";

import DateUtility from "../utils/DateUtility";

import classes from "./ModalEdit.module.css";

const ModalEdit = () => {
  const { inEditionReport, cleanEditReport, save } = useEditContext();

  if (!inEditionReport) return null;
  return (
    <ModalBase closeModal={cleanEditReport} zIndex={1}>
      <ModalWindow
        title={new Date(inEditionReport.timestampId).toLocaleDateString(
          "pt-br",
        )}
        closeModal={cleanEditReport}
      >
        <div className={`bg-neutral-white ${classes.container}`}>
          <div className={classes.reportInfo}>
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
            <CheckpointInput />
            <PrimaryButton onClick={save}>SALVAR</PrimaryButton>
          </div>
        </div>
      </ModalWindow>
    </ModalBase>
  );
};

export default ModalEdit;

