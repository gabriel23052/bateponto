import EraseIcon from "../assets/icons/erase.svg?react";

import classes from "./Checkpoint.module.css";

type Props = {
  start: number;
  end?: number;
  editMode?: boolean;
};

/**
 * Exibe um período
 */
const Checkpoint = ({ start, end, editMode }: Props) => {
  const getTimeString = (date: number) => {
    return new Date(date).toLocaleTimeString("pt-br", {
      timeStyle: "short",
    });
  };

  return (
    <li
      className={`neutral-dark text-default-m ${classes.container} ${editMode ? classes.editMode : ""}`}
    >
      {editMode && (
        <button>
          <EraseIcon width={12} height={12} />
        </button>
      )}
      <time dateTime={getTimeString(start)}>{getTimeString(start)}</time>
      {end && (
        <>
          <time dateTime={getTimeString(end)}>{getTimeString(end)}</time>
          {editMode && (
            <button>
              <EraseIcon width={12} height={12} />
            </button>
          )}
        </>
      )}
    </li>
  );
};

export default Checkpoint;
