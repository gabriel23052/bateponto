import { beforeEach, describe, expect, it } from "vitest";

import ClockHandler from "../src/utils/ClockHandler";
import { createOutOfRangeReports } from "./helpers";

const MILLISECONDS_IN_DAY = 86_400_000;
const REPORTS_RANGE_DAYS = 30;

describe("ClockHandler", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("constructor", () => {
    it(`Cria ${REPORTS_RANGE_DAYS} relatórios vazios caso não ainda não existam`, () => {
      const clockHandler = new ClockHandler();
      const reports = clockHandler.getReports(0, 30);
      expect(reports).toHaveLength(30);
    });

    it(`Cria os ${REPORTS_RANGE_DAYS} relatórios com ID's e objetos corretos`, () => {
      const clockHandler = new ClockHandler();
      const reports = clockHandler.getReports(0, 30);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < REPORTS_RANGE_DAYS; i++) {
        expect(reports[i]).toEqual({
          timestampId: today.getTime() - i * MILLISECONDS_IN_DAY,
          checkpoints: [],
          sum: 0,
          hasAdjustment: false,
        });
      }
    });

    it(`Corrige o período da forma correta`, () => {
      const DAYS_AGO = 4;
      createOutOfRangeReports(DAYS_AGO, REPORTS_RANGE_DAYS, "reports");
      const clockHandler = new ClockHandler();
      const reports = clockHandler.getReports(0, 30);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < REPORTS_RANGE_DAYS; i++) {
        expect(reports[i]).toEqual({
          timestampId: today.getTime() - i * MILLISECONDS_IN_DAY,
          checkpoints: [],
          sum: 0,
          hasAdjustment: false,
        });
      }
    });

    it("Adiciona batidas automáticas caso passe da meia noite em atividade", () => {
      const clockHandler = new ClockHandler();
      const yesterday = new Date(new Date().getTime() - MILLISECONDS_IN_DAY);
      yesterday.setHours(10, 30, 20, 155);
      clockHandler.addCheckpoint(yesterday);
      const anotherClockHandler = new ClockHandler();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expectedTodayReport: TReport = {
        timestampId: today.getTime(),
        checkpoints: [today.getTime()],
        sum: 0,
        hasAdjustment: false,
      };
      const expectedYesterdayReport: TReport = {
        timestampId: today.getTime() - MILLISECONDS_IN_DAY,
        checkpoints: [yesterday.getTime(), today.getTime() - 1],
        sum: 48_579_844,
        hasAdjustment: true,
      };
      expect(anotherClockHandler.getReports(0, 1)[0]).toBeDefined();
      expect(anotherClockHandler.getReports(1, 1)[0].checkpoints).toHaveLength(
        2,
      );
      expect(anotherClockHandler.getReports(0, 1)[0]).toEqual(
        expectedTodayReport,
      );
      expect(anotherClockHandler.getReports(1, 1)[0]).toEqual(
        expectedYesterdayReport,
      );
    });

    it("Falha ao adicionar batida no primeiro ou ultimo milissegundo do dia", () => {
      const clockHandler = new ClockHandler();
      const firstMillisecond = new Date();
      const lastMillisecond = new Date();
      firstMillisecond.setHours(0, 0, 0, 0);
      // Isso evita o erro "batida não pode ser adicionada no futuro"
      lastMillisecond.setDate(firstMillisecond.getDate() - 1);
      lastMillisecond.setHours(23, 59, 59, 999);
      expect(() => {
        clockHandler.addCheckpoint(firstMillisecond);
      }).toThrowError(
        "Checkpoints in the first and last milliseconds of the day are not allowed.",
      );
      expect(() => {
        clockHandler.addCheckpoint(lastMillisecond);
      }).toThrowError(
        "Checkpoints in the first and last milliseconds of the day are not allowed.",
      );
    });

    it("Não adiciona batidas de correção caso isso já tenha sido feito", () => {
      const clockHandler = new ClockHandler();
      const [yesterdayReport] = clockHandler.getReports(1, 1);
      yesterdayReport.hasAdjustment = true;
      clockHandler.addCheckpoint(
        new Date(yesterdayReport.timestampId + 10_000),
      );
      const anotherClockHandler = new ClockHandler();
      expect(anotherClockHandler.getReports(1, 1)[0].checkpoints).toHaveLength(
        1,
      );
    });
  });

  describe("addCheckpoint", () => {
    it("Adiciona batida no dia corrente", () => {
      const clockHandler = new ClockHandler();
      const now = new Date();
      clockHandler.addCheckpoint(now);
      expect(clockHandler.getReports(0, 1)).toHaveLength(1);
      expect(clockHandler.getReports(0, 1)[0].checkpoints).toEqual([
        now.getTime(),
      ]);
    });

    it("Adiciona batida dez dias atrás", () => {
      const clockHandler = new ClockHandler();
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * MILLISECONDS_IN_DAY);
      clockHandler.addCheckpoint(tenDaysAgo);
      expect(clockHandler.getReports(10, 1)).toHaveLength(1);
      expect(clockHandler.getReports(10, 1)[0].checkpoints).toEqual([
        tenDaysAgo.getTime(),
      ]);
    });

    it("Falha ao adicionar batida fora do período", () => {
      const clockHandler = new ClockHandler();
      const future = new Date();
      future.setDate(future.getDate() + 5);
      expect(() => {
        clockHandler.addCheckpoint(future);
      }).toThrow("Report don't found");
    });

    it("Falha ao adicionar no futuro", () => {
      const clockHandler = new ClockHandler();
      const future = new Date();
      future.setSeconds(future.getSeconds() + 5);
      expect(() => {
        clockHandler.addCheckpoint(future);
      }).toThrow("The report cannot be in the future");
    });

    it("Falha ao adicionar batida repetida", () => {
      const clockHandler = new ClockHandler();
      const now = new Date();
      clockHandler.addCheckpoint(now);
      expect(() => {
        clockHandler.addCheckpoint(now);
      }).toThrow("Checkpoint already exists in the report");
    });

    it("Soma os períodos corretamente", () => {
      const clockHandler = new ClockHandler();
      const yesterday = new Date(new Date().getTime() - MILLISECONDS_IN_DAY);
      yesterday.setHours(2, 52, 12, 65); // 10332065ms
      clockHandler.addCheckpoint(yesterday);
      yesterday.setHours(3, 6, 52, 747); // 11212747ms
      clockHandler.addCheckpoint(yesterday);
      yesterday.setHours(12, 43, 32, 858); // 45812858ms
      clockHandler.addCheckpoint(yesterday);
      yesterday.setHours(15, 29, 4, 472); // 55744472ms
      clockHandler.addCheckpoint(yesterday);
      // 11212747ms - 10332065ms = 880682ms
      // 45812858ms - 55744472ms = 9931614ms
      // 880682ms + 9931614ms = 10812296ms
      const report = clockHandler.getReports(1, 1);
      expect(report).toHaveLength(1);
      expect(report[0].checkpoints).toHaveLength(4);
      expect(report[0].sum).toBe(10_812_296);
    });
  });

  describe("refresh", () => {
    it("Corrige o período corretamente", () => {
      const DAYS_AGO = 1;
      const clockHandler = new ClockHandler();
      createOutOfRangeReports(DAYS_AGO, REPORTS_RANGE_DAYS, "reports");
      // @ts-expect-error — acesso intencional a membro privado para teste
      clockHandler.reportsMap.clear();
      // @ts-expect-error — acesso intencional a membro privado para teste
      clockHandler.getReportsFromLocalStorage();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(clockHandler.getReports(0, 1)).toHaveLength(0);
      clockHandler.refresh();
      expect(clockHandler.getReports(0, 1)[0].timestampId).toBe(
        today.getTime(),
      );
    });
  });
});
