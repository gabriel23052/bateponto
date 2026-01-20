import ClockHandler from "../src/utils/ClockHandler";
import DateUtility from "../src/utils/DateUtility";
import { describe, expect, it } from "vitest";

const MILLISECONDS_IN_DAY = 86_400_000;
const REPORTS_STORAGE_KEY = "reports";

type TestReport = {
  timestampId: number;
  checkpoints: string[];
  sum: string;
};

const parseTestReport = (testReport: TestReport): TReport => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    timestampId: testReport.timestampId,
    checkpoints: testReport.checkpoints.map((ch) => {
      const [hour, minute] = ch.split(":").map(Number);
      today.setHours(hour);
      today.setMinutes(minute);
      return today.getTime();
    }),
    sum: (() => {
      const [hour, minute] = testReport.sum.split(":").map(Number);
      return hour * 60 * 60 * 1000 + minute * 60 * 1000;
    })(),
  };
};

const testReport = parseTestReport({
  timestampId: DateUtility.getReportIdFromDate(new Date()),
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
});

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
  it("Instância a classe e cria os relatórios vazios", () => {
    localStorage.clear();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clockHandler = new ClockHandler();
    expect(localStorage.getItem(REPORTS_STORAGE_KEY)).toBeDefined();
  });

  it("Retorna erro quando localStorage contém JSON inválido", () => {
    localStorage.clear();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localStorage.setItem(REPORTS_STORAGE_KEY, "test");
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const instance = new ClockHandler();
    }).toThrow("Invalid JSON in localStorage");
  });

  it("Atualiza o período de relatórios simulando 2 dias inativos", () => {
    localStorage.clear();
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
    localStorage.clear();
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

  it("Adiciona algumas batidas no localStorage", () => {
    localStorage.clear();
    const today = new Date();
    const clockHandler = new ClockHandler();
    today.setMilliseconds(0);
    today.setSeconds(0);
    testReport.checkpoints.forEach((ch) =>
      clockHandler.addCheckpoint(new Date(ch)),
    );
    const reportsFromLocalStorage = getReportsFromLocalStorage();
    const timestampId = DateUtility.getReportIdFromDate(today);
    const targetReport = (
      reportsFromLocalStorage.find(
        (report) => report[0] === timestampId,
      ) as TReportKeyValue
    )[1];
    expect(targetReport).toEqual(testReport);
  });

  it("Adiciona mais uma batida para restar um número impár de batidas", () => {
    const clockHandler = new ClockHandler();
    const newCheckpoint = new Date();
    newCheckpoint.setHours(21, 25, 0, 0);
    clockHandler.addCheckpoint(newCheckpoint);
    testReport.checkpoints.push(newCheckpoint.getTime());
    const reportsFromLocalStorage = getReportsFromLocalStorage();
    const targetReport = (
      reportsFromLocalStorage.find(
        (report) =>
          report[0] === DateUtility.getReportIdFromDate(newCheckpoint),
      ) as TReportKeyValue
    )[1];
    expect(targetReport).toEqual(testReport);
  });

  it("Retorna erro ao tentar adicionar batida em 2010", () => {
    const clockHandler = new ClockHandler();
    const outOfRangeDate = new Date(2010, 0, 1);
    expect(() => {
      clockHandler.addCheckpoint(outOfRangeDate);
    }).toThrowError("Report don't found: " + outOfRangeDate.getTime());
  });

  it("Busca o relatório do dia corrente", () => {
    const clockHandler = new ClockHandler();
    const today = new Date();
    const EXPECTED: TReportView = {
      timestampId: DateUtility.getReportIdFromDate(new Date()),
      date: DateUtility.getReportViewDate(today),
      checkpoints: [
        ["09:00", "09:20"],
        ["10:16", "11:40"],
        ["15:25", "19:49"],
        ["19:55", "20:00"],
        ["21:25"],
      ],
      sum: "06:13",
      missingCheckpoint: true,
    };
    expect(clockHandler.getReports(0, 1)[0]).toEqual(EXPECTED);
  });

  it("Busca os relatórios entre 2 dias atrás e 12 dias atrás", () => {
    const clockHandler = new ClockHandler();
    expect(clockHandler.getReports(2, 10)).toHaveLength(10);
  });

  it("Busca 10 relatórios de 25 dias atrás", () => {
    const clockHandler = new ClockHandler();
    expect(clockHandler.getReports(25, 10)).toHaveLength(5);
  });

  it("Adiciona batida 15 dias atrás e efetua a busca", () => {
    const clockHandler = new ClockHandler();
    const oldReportTimestampId =
      DateUtility.getReportIdFromDate(new Date()) - MILLISECONDS_IN_DAY * 15;
    const oldCheckpoint = new Date(oldReportTimestampId);
    oldCheckpoint.setHours(10, 30);
    clockHandler.addCheckpoint(oldCheckpoint);
    oldCheckpoint.setHours(19, 15);
    clockHandler.addCheckpoint(oldCheckpoint);
    const EXPECTED: TReportView = {
      timestampId: DateUtility.getReportIdFromDate(oldCheckpoint),
      date: DateUtility.getReportViewDate(oldCheckpoint),
      checkpoints: [["10:30", "19:15"]],
      sum: "08:45",
      missingCheckpoint: false,
    };
    expect(clockHandler.getReports(15, 1)[0]).toEqual(EXPECTED);
  });
});
