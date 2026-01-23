import classes from "./Checkpoint.module.css";

type Props = {
  start: number;
  end?: number;
};

/**
 * Exibe um período
 */
const Checkpoint = ({ start, end }: Props) => {
  const getTimeString = (date: number) => {
    return new Date(date).toLocaleTimeString("pt-br", {
      timeStyle: "short",
    });
  };

  return (
    <li className={`neutral-dark text-default-m ${classes.container}`}>
      <time dateTime={getTimeString(start)}>{getTimeString(start)}</time>
      {end && <time dateTime={getTimeString(end)}>{getTimeString(end)}</time>}
    </li>
  );
};

export default Checkpoint;
