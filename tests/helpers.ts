const MILLISECONDS_IN_DAY = 86_400_000;

export function createOutOfRangeReports(
  daysAgo: number,
  amount: number,
  localStorageKey: string,
) {
  const reports: TReportKeyValue[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < amount; i++) {
    const timestampId = today.getTime() - (daysAgo + i) * MILLISECONDS_IN_DAY;
    reports.push([
      timestampId,
      {
        timestampId,
        checkpoints: [],
        sum: 0,
        hasAdjustment: false,
      },
    ]);
  }
  localStorage.setItem(localStorageKey, JSON.stringify(reports));
}
