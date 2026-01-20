import DateUtility from "./DateUtility";

/**
 * Manipula reports de forma individual
 */
export default class ReportHandler {
  /**
   *  Referência do report a ser manipulado
   */
  private reports: TReport;

  constructor(report: TReport) {
    this.reports = report;
  }

  /**
   * Adiciona uma nova batida em um determinado report
   */
  public addCheckpoint(clockInJsDate: Date) {
    const timestamp = clockInJsDate.getTime();
    if (this.reports.checkpoints.includes(timestamp))
      throw new Error("Checkpoint already exists in the report.");
    this.reports.checkpoints.push(timestamp);
    this.reports.checkpoints.sort((a, b) => a - b);
    this.calculateSum();
  }

  /**
   * Calcula a soma dos períodos
   */
  private calculateSum() {
    let sum = 0;
    for (let i = 0; i < this.reports.checkpoints.length; i += 2) {
      if (i + 1 < this.reports.checkpoints.length) {
        sum += this.reports.checkpoints[i + 1] - this.reports.checkpoints[i];
      }
    }
    this.reports.sum = sum;
  }

  /**
   * Converte os horários dos relatórios de formato humano para timestamps
   */
  public static parseReportToTimestamps(
    humanReport: TReportHumanFormat,
  ): TReport {
    const today = DateUtility.resetToZeroAtClock(new Date());
    return {
      checkpoints: humanReport.checkpoints.map((ch) => {
        const [hour, minute] = ch.split(":").map(Number);
        today.setHours(hour);
        today.setMinutes(minute);
        return today.getTime();
      }),
      sum: (() => {
        const [hour, minute] = humanReport.sum.split(":").map(Number);
        return hour * 60 * 60 * 1000 + minute * 60 * 1000;
      })(),
    };
  }
}
