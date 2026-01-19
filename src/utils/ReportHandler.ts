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
  public addTimestamp(clockInDate: Date) {
    const epoch = clockInDate.getTime();
    if (this.reports.timestamps.includes(epoch))
      throw new Error("Timestamp already exists in the report.");
    this.reports.timestamps.push(epoch);
    this.reports.timestamps.sort((a, b) => a - b);
    this.calculateSum();
  }

  /**
   * Calcula a soma dos períodos
   */
  private calculateSum() {
    let sum = 0;
    for (let i = 0; i < this.reports.timestamps.length; i += 2) {
      if (i + 1 < this.reports.timestamps.length) {
        sum += this.reports.timestamps[i + 1] - this.reports.timestamps[i];
      }
    }
    this.reports.sum = sum;
  }
}
