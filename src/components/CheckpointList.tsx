import Checkpoint from "./Checkpoint";

import AddIcon from "../assets/icons/add.svg?react";

import classes from "./CheckpointList.module.css";

type Props = {
  checkpoints: number[];
  editMode?: boolean;
};

/**
 * Exibe uma lista de períodos
 */
const CheckpointList = ({ checkpoints, editMode }: Props) => {
  return (
    <ul className={classes.container}>
      {Array.from({ length: Math.ceil(checkpoints.length / 2) }, (_, i) => (
        <Checkpoint
          start={checkpoints[i * 2]}
          end={checkpoints[i * 2 + 1]}
          editMode={editMode}
          key={checkpoints[i * 2]}
        />
      ))}
      {editMode && (
        <button className={`${classes.editButton}`}>
          <AddIcon width={18} height={18} />
        </button>
      )}
    </ul>
  );
};

export default CheckpointList;
