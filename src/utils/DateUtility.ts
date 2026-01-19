const MILLISECONDS_IN_HOUR = 3_600_000;

/**
 * Utilitário para manipulação de datas.
 */
export default class DateUtility {
  /**
   * Ajusta a data para o início do dia (00:00:00.000) e retorna.
   */
  public static resetToZeroAtClock(date: Date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  public static getDateFromFriendlyString(dateString: string): Date {
    const [datePart, timePart] = dateString.split("-");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  public static getHourFromMiliseconds(milliseconds: number): string {
    const hours = Math.floor(milliseconds / MILLISECONDS_IN_HOUR);
    const minutes = Math.floor((milliseconds % MILLISECONDS_IN_HOUR) / 60000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }
}
