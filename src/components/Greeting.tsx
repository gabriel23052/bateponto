import classes from "./Greeting.module.css";

/**
 * Texto de saudação dinâmico, vária conforme horário do dia
 */
const Greeting = () => {
  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    return hour < 5
      ? "Boa madrugada"
      : hour < 12
      ? "Bom dia"
      : hour < 18
      ? "Boa tarde"
      : "Boa noite";
  };

  return (
    <p className={`neutral-darkgray primary-default ${classes.greeting}`}>
      {getDynamicGreeting()}! Marque o tempo investido em qualquer atividade da
      mesma forma que um relógio ponto
    </p>
  );
};

export default Greeting;
