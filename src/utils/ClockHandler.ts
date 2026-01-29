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
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      this.createReports();
      return;
    }
    this.getReportsFromLocalStorage();
    this.updateReportsRange();
    this.adjustYesterdayIfNeeds();
  }

  /**
   * Retorna os relatórios armazenados no localStorage e os
   * insere no mapa de relatórios
   */
  private getReportsFromLocalStorage() {
    const reportsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (reportsJSON === null) return;
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
    reports.forEach(([timestampId, rp]) => {
      this.reportsMap.set(timestampId, rp);
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
    const todayDate = DateUtility.getReportIdFromDate(new Date());
    for (let i = 0; i < REPORTS_RANGE_DAYS; i++) {
      const timestampId = todayDate - i * MILLISECONDS_IN_DAY;
      const emptyReport: TReport = {
        timestampId: timestampId,
        checkpoints: [],
        sum: 0,
        hasAdjustment: false,
      };
      this.reportsMap.set(timestampId, emptyReport);
    }
    this.updateLocalStorage();
  }

  /**
   * Atualiza o intervalo de relatórios, removendo entradas antigas e
   * adicionando novas entradas vazias conforme necessário
   */
  private updateReportsRange() {
    const reportTimestampIds = Array.from(this.reportsMap.keys());
    const todayTimestampId = DateUtility.getReportIdFromDate(new Date());
    const limitTimestampId =
      todayTimestampId - (REPORTS_RANGE_DAYS - 1) * MILLISECONDS_IN_DAY;
    const toErase = reportTimestampIds.filter(
      (timestampId) => timestampId < limitTimestampId,
    );
    if (toErase.length === 0) return;
    for (let i = 0; i < toErase.length; i++) {
      this.reportsMap.delete(toErase[i]);
      const timestampId = todayTimestampId - i * MILLISECONDS_IN_DAY;
      this.reportsMap.set(timestampId, {
        timestampId,
        checkpoints: [],
        sum: 0,
        hasAdjustment: false,
      });
    }
    this.updateLocalStorage();
  }

  /**
   * Adiciona uma batida no último milissegundo do dia anterior e no primeiro do dia
   * corrente caso o dia anterior tenha sido encerrado com número ímpar de batidas
   */
  private adjustYesterdayIfNeeds() {
    const [yesterdayReport] = this.getReports(1, 1);
    if (
      yesterdayReport.checkpoints.length % 2 === 0 ||
      yesterdayReport.hasAdjustment
    )
      return;
    const [todayReport] = this.getReports(0, 1);
    const yesterdayCheckpoint = new Date(todayReport.timestampId - 1);
    const todayCheckpoint = new Date(todayReport.timestampId);
    yesterdayReport.hasAdjustment = true;
    this.addCheckpoint(yesterdayCheckpoint, true);
    this.addCheckpoint(todayCheckpoint, true);
  }

  /**
   * Adiciona uma nova batida em um relatório, retorna o relatório atualizado
   */
  public addCheckpoint(clockInDate: Date, skipValidation = false) {
    const timestampId = DateUtility.getReportIdFromDate(clockInDate);
    const report = this.reportsMap.get(timestampId);
    if (!report) throw new Error("Report don't found: " + timestampId);
    if (new Date().getTime() < clockInDate.getTime())
      throw new Error("The report cannot be in the future");

    const reportHandler = new ReportHandler(report);
    reportHandler.addCheckpoint(clockInDate, skipValidation);
    this.updateLocalStorage();
    return {
      ...report,
      checkpoints: [...report.checkpoints],
    };
  }

  /**
   * Substitui um relatório no mapa e atualiza o localStorage
   */
  public replaceReport(report: TReport) {
    this.reportsMap.set(report.timestampId, report);
    this.updateLocalStorage();
  }

  /**
   * Retorna os relatórios dado um número de dias atrás e
   * a quantidade
   */
  public getReports(daysOffset: number, amount: number): TReport[] {
    const todayTimestampId = DateUtility.getReportIdFromDate(new Date());
    const reports: TReport[] = [];
    for (let i = 0; i < amount; i++) {
      const targetTimestampId =
        todayTimestampId -
        (daysOffset * MILLISECONDS_IN_DAY + i * MILLISECONDS_IN_DAY);
      const report = this.reportsMap.get(targetTimestampId);
      if (!report) continue;
      reports.push(report);
    }
    return reports;
  }
  /**
   * Atualiza o estado, deve ser chamada meia-noite
   */
  public refresh() {
    this.updateReportsRange();
    this.adjustYesterdayIfNeeds();
  }
}
