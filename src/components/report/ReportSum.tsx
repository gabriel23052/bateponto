import ClockIcon from "../../assets/icons/clock.svg?react";
import AlertIcon from "../../assets/icons/alert.svg?react";

import { useClockContext } from "../../contexts/ClockContext";

import classes from "./ReportSum.module.css";

type Props = {
  sum: string;
  missingCheckpoint?: boolean;
  disableAlert?: boolean;
};

/**
 * Componente que exibe a soma dos períodos
 */
const ReportSum = ({ sum, missingCheckpoint, disableAlert }: Props) => {
  const { inActivity } = useClockContext();

  return (
    <div className={classes.container}>
      <div>
        {missingCheckpoint && !disableAlert && (
          <AlertIcon
            width={20}
            height={20}
            className={classes.alert}
            title="Alerta: Número ímpar de batidas"
            role="img"
          />
        )}
        <ClockIcon
          className={`${classes.clockIcon} ${inActivity ? classes.activity : ""}`}
          width={21}
          height={24}
          title="Soma do dia"
          role="img"
        />
      </div>
      <p className="neutral-dark text-large">{sum}</p>
    </div>
  );
};

export default ReportSum;
