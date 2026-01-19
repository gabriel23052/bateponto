import DateUtility from "./DateUtility";
import ReportHandler from "./ReportHandler";

const MILLISECONDS_PER_DAY = 86_400_000;
const REPORTS_PERIOD_DAYS = 30;
const LOCAL_STORAGE_KEY = "reports";

type TReportEntries = [number, TReport][];

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
    const storageReports = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storageReports === null) {
      this.createReports();
      return;
    }
    this.getReportsFromLocalStorage();
    this.updateReportsRange();
  }

  /**
   * Atualiza o localStorage com o conteúdo atual do
   * mapa de relatórios
   */
  private updateLocalStorage() {
    const reports: TReportEntries = Array.from(this.reportsMap.entries());
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
  }

  /**
   * Preenche o mapa de relatórios com entradas vazias
   * para os últimos 30 dias caso ainda não exista
   */
  private createReports() {
    const todayDate = new Date();
    const reports: TReportEntries = [];
    DateUtility.resetToZeroAtClock(todayDate);
    for (let i = 0; i < REPORTS_PERIOD_DAYS; i++) {
      const reportDayEpoch = todayDate.getTime() - i * MILLISECONDS_PER_DAY;
      const emptyReport: TReport = { timestamps: [], sum: 0 };
      reports.push([reportDayEpoch, emptyReport]);
      this.reportsMap.set(reportDayEpoch, emptyReport);
    }
    this.updateLocalStorage();
  }

  /**
   * Retorna os relatórios armazenados no localStorage e os
   * insere no mapa de relatórios
   */
  private getReportsFromLocalStorage() {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY) as string;
    const reports: TReportEntries = JSON.parse(storage);
    reports.forEach(([reportDayEpoch, report]) => {
      this.reportsMap.set(reportDayEpoch, report);
    });
  }

  /**
   * Atualiza o intervalo de relatórios, removendo entradas antigas e
   * adicionando novas entradas vazias conforme necessário
   */
  private updateReportsRange() {
    const reportsEpoch = Array.from(this.reportsMap.keys());
    const limitEpoch =
      DateUtility.resetToZeroAtClock(new Date()).getTime() -
      (REPORTS_PERIOD_DAYS - 1) * MILLISECONDS_PER_DAY;
    const toErase = reportsEpoch.filter(
      (reportEpoch) => reportEpoch < limitEpoch,
    );
    if (toErase.length === 0) return;
    const todayDate = DateUtility.resetToZeroAtClock(new Date());
    for (let i = 0; i < toErase.length; i++) {
      this.reportsMap.delete(toErase[i]);
      this.reportsMap.set(todayDate.getTime() - i * MILLISECONDS_PER_DAY, {
        timestamps: [],
        sum: 0,
      });
    }
    this.updateLocalStorage();
  }

  /**
   * Adiciona uma nova batida em um report
   */
  public addTimestamp(clockInDate: Date) {
    const reportEpoch = DateUtility.resetToZeroAtClock(
      new Date(clockInDate),
    ).getTime();
    const report = this.reportsMap.get(reportEpoch);
    if (!report) throw new Error("Report out of bounds: " + reportEpoch);
    const reportHandler = new ReportHandler(report);
    reportHandler.addTimestamp(clockInDate);
    this.updateLocalStorage();
  }

  /**
   * Printa no console uma tabela com as datas dos
   * relatórios armazenados
   */
  public logReportsDates() {
    const reports: TReportEntries = Array.from(this.reportsMap.entries()).sort(
      (a, b) => b[0] - a[0],
    );
    const friendlyReports = reports.map(([epoch, report]) => {
      const reportDate = new Date(epoch);
      const friendlyDate = reportDate.toLocaleDateString("pt-BR");
      const friendlyTimestamps =
        report.timestamps
          .map((ts) => {
            const date = new Date(ts);
            return `${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          })
          .join(" - ") +
        " --> " +
        DateUtility.getHourFromMiliseconds(report.sum);
      return [friendlyDate, friendlyTimestamps];
    });
    console.table(friendlyReports);
  }
}
