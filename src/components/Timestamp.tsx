import classes from "./Timestamp.module.css";

type Props = {
  start: string;
  end?: string;
};

/**
 * Exibe um período
 */
const Timestamp = ({ start, end }: Props) => {
  return (
    <li className={`neutral-dark text-default-m ${classes.container}`}>
      <time dateTime={start}>{start}</time>
      {end && <time dateTime={end}>{end}</time>}
    </li>
  );
};

export default Timestamp;
