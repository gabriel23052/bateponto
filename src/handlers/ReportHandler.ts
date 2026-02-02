const MILLISECONDS_IN_DAY = 86_400_000;

/**
 * Manipula reports de forma individual
 */
export default class ReportHandler {
  /**
   * Referência do report a ser manipulado
   */
  private report: TReport;

  /**
   * Construtor, apenas armazena a referência do relatório
   * @param report Referência do relatório a ser manipulado
   */
  constructor(report: TReport) {
    this.report = report;
  }

  /**
   * Adiciona uma nova batida em um determinado report
   * @param newCheckpointDate Data da nova batida
   * @param skipValidation Define se a função deve pular a validação de primeiro e último milissegundo do dia
   */
  public addCheckpoint(newCheckpointDate: Date, skipValidation = false) {
    const checkpointTimestamp = newCheckpointDate.getTime();
    if (this.report.checkpoints.includes(checkpointTimestamp))
      throw new Error("Checkpoint already exists in the report.");
    if (
      !skipValidation &&
      (checkpointTimestamp === this.report.id ||
        checkpointTimestamp === this.report.id + MILLISECONDS_IN_DAY - 1)
    )
      throw new Error(
        "Checkpoints in the first and last milliseconds of the day are not allowed.",
      );
    this.report.checkpoints.push(checkpointTimestamp);
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
