type TDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type TShortDayOfWeek = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

type TReportViewDate = {
  today: boolean;
  shortDate: string;
  dayOfWeek: TShortDayOfWeek;
};

type TReportView = {
  date: TReportViewDate;
  timestamps: string[][];
  sum: string;
  missingTimestamp: boolean;
};

type TReport = {
  timestamps: number[];
  sum: number;
}
