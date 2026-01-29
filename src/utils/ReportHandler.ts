const MILLISECONDS_IN_DAY = 86_400_000;

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
  public addCheckpoint(clockInJsDate: Date, skipValidation = false) {
    const timestamp = clockInJsDate.getTime();
    if (this.report.checkpoints.includes(timestamp))
      throw new Error("Checkpoint already exists in the report.");
    if (
      !skipValidation &&
      (timestamp === this.report.timestampId ||
        timestamp === this.report.timestampId + MILLISECONDS_IN_DAY - 1)
    )
      throw new Error(
        "Checkpoints in the first and last milliseconds of the day are not allowed.",
      );
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
}
