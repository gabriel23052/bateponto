import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

import ClockAddIcon from "../../assets/icons/clock-add.svg?react";

import { useEditContext } from "../../contexts/EditContext";

import classes from "./CheckpointInput.module.css";

type Props = {
  setError: Dispatch<SetStateAction<string | null>>;
};

/**
 * Exibe um input do tipo "time" para editar novas batidas na edição
 * @param setError Callback para setar erros
 */
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
    const newCheckpointDate = new Date((inEditionReport as TReport).id);
    // Adiciona um milissegundo caso a batida seja meia noite
    newCheckpointDate.setHours(hr, min, 0, hr === 0 && min === 0 ? 1 : 0);
    const error = validateNewCheckpoint(newCheckpointDate);
    if (error !== null) {
      setError(error);
      return;
    }
    addCheckpoint(newCheckpointDate);
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

