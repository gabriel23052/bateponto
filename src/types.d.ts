type TDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type TShortDayOfWeek = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

type TReportViewDate = {
  today: boolean;
  shortDate: string;
  dayOfWeek: TShortDayOfWeek;
};

type TReportView = {
  timestampId: number;
  date: TReportViewDate;
  checkpoints: string[][];
  sum: string;
  missingCheckpoint: boolean;
};

type TReport = {
  timestampId: number;
  checkpoints: number[];
  sum: number;
};

type TReportKeyValue = [number, TReport];
