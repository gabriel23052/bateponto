import Checkpoint from "./Checkpoint";

import classes from "./CheckpointList.module.css";

type Props = {
  checkpoints: number[];
  editMode?: boolean;
};

/**
 * Exibe uma lista de batidas
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
    </ul>
  );
};

export default CheckpointList;
