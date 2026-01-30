const MILLISECONDS_IN_HOUR = 3_600_000;
const MILLISECONDS_IN_MINUTE = 60_000;
const SHORT_DAYS_OF_WEEK: TShortDayOfWeek[] = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
];

/**
 * Utilitário para manipulação de datas.
 */
export default class DateUtility {
  /**
   * Retorna um timestamp id para o relatório a partir de uma data
   * @param date Data da qual será retornada o id
   */
  public static getReportIdFromDate(date: Date) {
    const idDate = new Date(date);
    idDate.setHours(0, 0, 0, 0);
    return idDate.getTime();
  }

  /**
   * Retorna a data em forma de visualização amigável
   * @param id ID do qual será gerado a data
   */
  public static getReportViewDate(id: number): TReportViewDate {
    const todayDate = new Date();
    const date = new Date(id);
    todayDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return {
      dayOfWeek: SHORT_DAYS_OF_WEEK[date.getDay()],
      today: date.getTime() - todayDate.getTime() === 0,
      shortDate: `${day}/${month}`,
    };
  }

  /**
   * Retorna a soma de um relatório em formato de visualização amigável
   * @param milliseconds Soma em milissegundos
   */
  public static getSumView(milliseconds: number) {
    const hr = Math.floor(milliseconds / MILLISECONDS_IN_HOUR);
    const min = Math.floor(
      (milliseconds - hr * MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE,
    );
    return (
      hr.toString().padStart(2, "0") + ":" + min.toString().padStart(2, "0")
    );
  }

  /**
   * Retorna o horário em formato amigável
   * @param timestamp Timestamp do horário
   */
  public static getTimeView(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString("pt-br", {
      timeStyle: "short",
    });
  }
}
