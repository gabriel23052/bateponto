import Greeting from "./Greeting";

import classes from "./App.module.css";

/**
 * Container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <Greeting />
    </main>
  );
};

export default App;
