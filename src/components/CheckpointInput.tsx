import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

import { useEditContext } from "../contexts/EditContext";

import ClockAddIcon from "../assets/icons/clockAdd.svg?react";

import classes from "./CheckpointInput.module.css";

type Props = {
  setError: Dispatch<SetStateAction<string | null>>;
};

const CheckpointInput = ({ setError }: Props) => {
  const [newCheckpoint, setNewCheckpoint] = useState({
    value: "00:00",
    hasEdited: false,
  });

  const { validateNewCheckpoint, addCheckpoint, inEditionReport } =
    useEditContext();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [hr, min] = newCheckpoint.value.split(":").map(Number);
    const checkpointDate = new Date((inEditionReport as TReport).timestampId);
    checkpointDate.setHours(hr, min);
    const error = validateNewCheckpoint(checkpointDate);
    if (error !== null) {
      setError(error);
      return;
    }
    addCheckpoint(checkpointDate);
    setError(null);
    setNewCheckpoint({ value: "00:00", hasEdited: false });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCheckpoint({ value: e.target.value, hasEdited: true });
    setError(null);
  };

  return (
    <form className={`${classes.container}`} onSubmit={submit}>
      <input
        className={`neutral-dark text-default-m ${classes.input}`}
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

