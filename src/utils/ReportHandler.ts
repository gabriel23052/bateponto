import DateUtility from "./DateUtility";

/**
 * Manipula reports de forma individual
 */
export default class ReportHandler {
  /**
   * Referência do report a ser manipulado
   */
  private report: TReport;

  constructor(report: TReport) {
    this.report = report;
  }

  /**
   * Adiciona uma nova batida em um determinado report
   */
  public addCheckpoint(clockInJsDate: Date) {
    const timestamp = clockInJsDate.getTime();
    if (this.report.checkpoints.includes(timestamp))
      throw new Error("Checkpoint already exists in the report.");
    this.report.checkpoints.push(timestamp);
    this.report.checkpoints.sort((a, b) => a - b);
    this.calculateSum();
  }

  /**
   * Calcula a soma dos períodos
   */
  private calculateSum() {
    let sum = 0;
    for (let i = 0; i < this.report.checkpoints.length; i += 2) {
      if (i + 1 < this.report.checkpoints.length) {
        sum += this.report.checkpoints[i + 1] - this.report.checkpoints[i];
      }
    }
    this.report.sum = sum;
  }

  /**
   * Retorna um relatório na forma de visualização a partir de
   * um relatório comum
   */
  public static getViewFormat(report: TReport): TReportView {
    const date = DateUtility.getReportViewDate(new Date(report.timestampId));
    const checkpoints: string[][] = [];
    for (let i = 0; i < report.checkpoints.length; i += 2) {
      const viewCheckpoint = [
        DateUtility.viewTimeFromTimestamp(report.checkpoints[i]),
      ];
      if (report.checkpoints[i + 1]) {
        viewCheckpoint.push(
          DateUtility.viewTimeFromTimestamp(report.checkpoints[i + 1]),
        );
      }
      checkpoints.push(viewCheckpoint);
    }
    return {
      timestampId: report.timestampId,
      date,
      checkpoints,
      missingCheckpoint: report.checkpoints.length % 2 !== 0,
      sum: DateUtility.viewTimeFromMilliseconds(report.sum),
    };
  }
}
