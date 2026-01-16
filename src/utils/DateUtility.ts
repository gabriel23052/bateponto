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
}
 