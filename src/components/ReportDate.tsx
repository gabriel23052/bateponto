import classes from "./ReportDate.module.css";

type Props = {
  date: TReportDate;
};

/**
 * Exibe a data nos históricos
 */
const ReportDate = ({ date }: Props) => {
  return (
    <div className={`neutral-darkgray text-default ${classes.container}`}>
      <p>{date.today ? "Hoje" : date.shortDate}</p>
      {!date.today && <p>{date.dayOfWeek}</p>}
    </div>
  );
};

export default ReportDate;
