import Checkpoint from "./Checkpoint";

import classes from "./CheckpointList.module.css";

type Props = {
  checkpoints: string[][];
};

/**
 * Exibe uma lista de períodos
 */
const CheckpointList = ({ checkpoints }: Props) => {
  return (
    <ul className={`${classes.container}`}>
      {checkpoints.map((timestamp) => (
        <Checkpoint
          start={timestamp[0]}
          end={timestamp[1]}
          key={timestamp[0]}
        />
      ))}
    </ul>
  );
};

export default CheckpointList;
