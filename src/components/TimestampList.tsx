import Timestamp from "./Timestamp";

import classes from "./TimestampList.module.css";

type Props = {
  timestamps: string[][];
};

/**
 * Exibe uma lista de períodos
 */
const TimestampList = ({ timestamps }: Props) => {
  return (
    <ul className={`${classes.container}`}>
      {timestamps.map((timestamp) => (
        <Timestamp start={timestamp[0]} end={timestamp[1]} key={timestamp[0]} />
      ))}
    </ul>
  );
};

export default TimestampList;
