import ClockHandler from "../src/utils/ClockHandler";
import DateUtility from "../src/utils/DateUtility";
import { beforeEach, describe, expect, it } from "vitest";
import ReportHandler from "../src/utils/ReportHandler";

const MILLISECONDS_IN_DAY = 86_400_000;
const REPORTS_STORAGE_KEY = "reports";

const getReportsFromLocalStorage = () => {
  const reports = localStorage.getItem(REPORTS_STORAGE_KEY);
  if (reports === null) throw new Error("Reports don't found in localStorage");
  let parsedReports: TReportKeyValue[];
  try {
    parsedReports = JSON.parse(reports);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw new Error("Invalid JSON in localStorage");
  }
  return parsedReports;
};

describe("ClockHandler", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Instância a classe e cria os relatórios vazios", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clockHandler = new ClockHandler();
    expect(localStorage.getItem(REPORTS_STORAGE_KEY)).toBeDefined();
  });

  it("Retorna erro quando localStorage contém JSON inválido", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localStorage.setItem(REPORTS_STORAGE_KEY, "test");
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const instance = new ClockHandler();
    }).toThrow("Invalid JSON in localStorage");
  });

  it("Atualiza o período de relatórios simulando 2 dias inativos", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clockHandler = new ClockHandler();
    const reports: TReportKeyValue[] = getReportsFromLocalStorage();
    const reportsCopy = structuredClone(reports);
    for (let i = 0; i < reports.length; i++) {
      reports[i][0] -= MILLISECONDS_IN_DAY * 2;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newClockHandler = new ClockHandler();
    const newReports: TReportKeyValue[] = getReportsFromLocalStorage();
    expect(newReports).toEqual(reportsCopy);
  });

  it("Atualiza o período de relatórios simulando 80 dias inativos", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clockHandler = new ClockHandler();
    const reports: TReportKeyValue[] = getReportsFromLocalStorage();
    const reportsCopy = structuredClone(reports);
    for (let i = 0; i < reports.length; i++) {
      reports[i][0] -= MILLISECONDS_IN_DAY * 80;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newClockHandler = new ClockHandler();
    const newReports: TReportKeyValue[] = getReportsFromLocalStorage();
    expect(newReports).toEqual(reportsCopy);
  });

  it("Adiciona uma quantidade par de batidas no dia corrente", () => {
    const today = new Date();
    const clockHandler = new ClockHandler();
    today.setMilliseconds(0);
    today.setSeconds(0);
    const testReport = {
      checkpoints: [
        "09:00",
        "09:20",
        "10:16",
        "11:40",
        "15:25",
        "19:49",
        "19:55",
        "20:00",
      ],
      sum: "06:13",
    };
    const parsedTestReport = ReportHandler.parseReportToTimestamps(testReport);
    parsedTestReport.checkpoints.forEach((ch) =>
      clockHandler.addTimestamp(new Date(ch)),
    );
    const reportsFromLocalStorage = getReportsFromLocalStorage();
    const targetReport = (
      reportsFromLocalStorage.find(
        (report) =>
          report[0] === DateUtility.resetToZeroAtClock(today).getTime(),
      ) as TReportKeyValue
    )[1];
    expect(targetReport).toEqual(parsedTestReport);
  });

  it("Adiciona uma quantidade impár de batidas no dia corrente", () => {
    const today = new Date();
    const clockHandler = new ClockHandler();
    today.setMilliseconds(0);
    today.setSeconds(0);
    const testReport = {
      checkpoints: [
        "09:00",
        "09:20",
        "10:16",
        "11:40",
        "15:25",
        "19:49",
        "19:55",
      ],
      sum: "06:08",
    };
    const parsedTestReport = ReportHandler.parseReportToTimestamps(testReport);
    parsedTestReport.checkpoints.forEach((ch) =>
      clockHandler.addTimestamp(new Date(ch)),
    );
    const reportsFromLocalStorage = getReportsFromLocalStorage();
    const targetReport = reportsFromLocalStorage.find(
      (report) => report[0] === DateUtility.resetToZeroAtClock(today).getTime(),
    );
    expect(Array.isArray(targetReport) ? targetReport[1] : null).toEqual(
      parsedTestReport,
    );
  });

  it("Retorna erro ao tentar adicionar batida em 2010", () => {
    const clockHandler = new ClockHandler();
    const nonexistentReportKey = new Date(2010, 0, 1);
    expect(() => {
      clockHandler.addTimestamp(nonexistentReportKey)
    }).toThrowError("Report don't found: " + nonexistentReportKey.getTime())
  });
});
