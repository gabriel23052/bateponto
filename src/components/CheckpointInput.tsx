import { useState, type ChangeEvent, type FormEvent } from "react";

import ModalNotice from "./ModalNotice";

import { useEditContext } from "../contexts/EditContext";

import ClockAddIcon from "../assets/icons/clockAdd.svg?react";

import classes from "./CheckpointInput.module.css";

const CheckpointInput = () => {
  const [newCheckpoint, setNewCheckpoint] = useState({
    value: "00:00",
    hasEdited: false,
  });
  const [modalMessage, setModalMessage] = useState<null | string>(null);

  const { validateNewCheckpoint, addCheckpoint, inEditionReport } =
    useEditContext();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [hr, min] = newCheckpoint.value.split(":").map(Number);
    const checkpointDate = new Date((inEditionReport as TReport).timestampId);
    checkpointDate.setHours(hr, min);
    const error = validateNewCheckpoint(checkpointDate);
    if (error !== null) {
      setModalMessage(error);
      return;
    }
    addCheckpoint(checkpointDate);
    setNewCheckpoint({ value: "00:00", hasEdited: false });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCheckpoint({ value: e.target.value, hasEdited: true });
  };

  return (
    <form className={`${classes.container}`} onSubmit={submit}>
      {modalMessage && (
        <ModalNotice
          closeModal={() => {
            setModalMessage(null);
          }}
        >
          {modalMessage}
        </ModalNotice>
      )}
      <input
        className={`neutral-darkgray text-default-m bg-neutral-xlight ${classes.input}`}
        id="newCheckpoint"
        name="newCheckpoint"
        type="time"
        maxLength={5}
        value={newCheckpoint.value}
        onChange={handleChange}
      />
      <button
        className={`bg-neutral-dark ${classes.button}`}
        disabled={newCheckpoint.value.length === 0 || !newCheckpoint.hasEdited}
      >
        <ClockAddIcon width={24} height={24} />
      </button>
    </form>
  );
};

export default CheckpointInput;

