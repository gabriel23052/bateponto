const MILLISECONDS_IN_DAY = 86_400_000;

export function createOutOfRangeReports(
  daysAgo: number,
  amount: number,
  localStorageKey: string,
) {
  const reports: TReportKeyValue[] = [];
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  for (let i = 0; i < amount; i++) {
    const id = todayDate.getTime() - (daysAgo + i) * MILLISECONDS_IN_DAY;
    reports.push([
      id,
      {
        id: id,
        checkpoints: [],
        sum: 0,
        status: id === yesterdayDate.getTime() ? "verified" : "notVerified",
      },
    ]);
  }
  localStorage.setItem(localStorageKey, JSON.stringify(reports));
}
