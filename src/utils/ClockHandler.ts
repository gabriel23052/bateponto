import DateUtility from "./DateUtility";
import ReportHandler from "./ReportHandler";

const MILLISECONDS_IN_DAY = 86_400_000;
const REPORTS_RANGE_DAYS = 30;
const LOCAL_STORAGE_KEY = "reports";

/**
 * Manipula os relatórios diários armazenados no localStorage
 */
export default class ClockHandler {
  /**
   *  Mapa de relatórios
   */
  private reportsMap: Map<number, TReport> = new Map();

  /**
   * Inicializa o ClockHandler, carregando os relatórios
   * do localStorage ou criando novos
   */
  constructor() {
    this.getReportsFromLocalStorage();
    this.updateReportsRange();
  }

  /**
   * Retorna os relatórios armazenados no localStorage e os
   * insere no mapa de relatórios
   */
  private getReportsFromLocalStorage() {
    const reportsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (reportsJSON === null) {
      this.createReports();
      return;
    }
    const reports = (() => {
      let reports: TReportKeyValue[];
      try {
        reports = JSON.parse(reportsJSON);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        throw new Error("Invalid JSON in localStorage");
      }
      return reports;
    })();
    reports.forEach(([rpTimestampKey, rp]) => {
      this.reportsMap.set(rpTimestampKey, rp);
    });
  }

  /**
   * Atualiza o localStorage com o conteúdo atual do
   * mapa de relatórios
   */
  private updateLocalStorage() {
    const reports: TReportKeyValue[] = Array.from(this.reportsMap.entries());
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
  }

  /**
   * Preenche o mapa de relatórios com entradas vazias
   * para os últimos 30 dias caso ainda não exista
   */
  private createReports() {
    const todayDate = new Date();
    DateUtility.resetToZeroAtClock(todayDate);
    for (let i = 0; i < REPORTS_RANGE_DAYS; i++) {
      const reportTimestampKey = todayDate.getTime() - i * MILLISECONDS_IN_DAY;
      const emptyReport: TReport = { checkpoints: [], sum: 0 };
      this.reportsMap.set(reportTimestampKey, emptyReport);
    }
    this.updateLocalStorage();
  }

  /**
   * Atualiza o intervalo de relatórios, removendo entradas antigas e
   * adicionando novas entradas vazias conforme necessário
   */
  private updateReportsRange() {
    const reportsTimestampKeys = Array.from(this.reportsMap.keys());
    const limitTimestamp =
      DateUtility.resetToZeroAtClock(new Date()).getTime() -
      (REPORTS_RANGE_DAYS - 1) * MILLISECONDS_IN_DAY;
    const toErase = reportsTimestampKeys.filter(
      (rpTimestampKey) => rpTimestampKey < limitTimestamp,
    );
    if (toErase.length === 0) return;
    const todayDate = DateUtility.resetToZeroAtClock(new Date());
    for (let i = 0; i < toErase.length; i++) {
      this.reportsMap.delete(toErase[i]);
      this.reportsMap.set(todayDate.getTime() - i * MILLISECONDS_IN_DAY, {
        checkpoints: [],
        sum: 0,
      });
    }
    this.updateLocalStorage();
  }

  /**
   * Adiciona uma nova batida em um report
   */
  public addTimestamp(clockInDate: Date) {
    const reportTimestampKey = DateUtility.resetToZeroAtClock(
      new Date(clockInDate),
    ).getTime();
    const report = this.reportsMap.get(reportTimestampKey);
    if (!report) throw new Error("Report don't found: " + reportTimestampKey);
    const reportHandler = new ReportHandler(report);
    reportHandler.addCheckpoint(clockInDate);
    this.updateLocalStorage();
  }

  /**
   * Printa no console uma tabela com as datas dos
   * relatórios armazenados
   */
  public logReportsDates() {
    const reports: TReportKeyValue[] = Array.from(
      this.reportsMap.entries(),
    ).sort((a, b) => b[0] - a[0]);
    const humanFormatReports = reports.map(([timestampKey, rp]) => {
      const reportDate = new Date(timestampKey);
      const humanDate = reportDate.toLocaleDateString("pt-BR");
      const humamCheckpoints =
        rp.checkpoints
          .map((ts) => {
            const date = new Date(ts);
            return `${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          })
          .join(" - ") +
        " --> " +
        DateUtility.humanTimeFromMilliseconds(rp.sum);
      return [humanDate, humamCheckpoints];
    });
    console.table(humanFormatReports);
  }
}
