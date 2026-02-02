import classes from "./Description.module.css";

/**
 * Exibe uma descrição da aplicação
 */
const Description = () => {
  return (
    <p className={`neutral-darkgray primary-default ${classes.text}`}>
      Marque o tempo investido em qualquer atividade da mesma forma que um
      relógio ponto
    </p>
  );
};

export default Description;
