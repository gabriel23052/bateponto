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
        });
      }
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
});
