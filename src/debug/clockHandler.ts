import ClockHandler from "../utils/ClockHandler";
import DateUtility from "../utils/DateUtility";

const clockHandler = new ClockHandler();

const testClockInDates = [
  "18/01/2026-09:00",
  "18/01/2026-09:20",
  "18/01/2026-10:16",
  "18/01/2026-11:40",
  "18/01/2026-15:25",
  "18/01/2026-19:49",
  "18/01/2026-19:55",
  "18/01/2026-20:00",
];

testClockInDates.forEach((dateString) => {
  try {
    clockHandler.addTimestamp(
      DateUtility.getDateFromFriendlyString(dateString),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    /* empty */
  }
});

clockHandler.logReportsDates();
