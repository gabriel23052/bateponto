import Greeting from "./Greeting";
import Clock from "./Clock";

import classes from "./App.module.css";

/**
 * Container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <Greeting />
      <Clock />
    </main>
  );
};

export default App;
