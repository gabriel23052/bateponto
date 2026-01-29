import Greeting from "./Greeting";
import Clock from "./clock/Clock";
import DateText from "./DateText";
import CheckpointButton from "./checkpoint/CheckpointButton";
import TodayReport from "./TodayReport";
import History from "./History";
import ModalEditWrapper from "./modal/ModalEditWrapper";
import ModalNotice from "./modal/ModalNotice";
import BackToTop from "./BackToTop";

import { ClockContextProvider } from "../contexts/ClockContext";
import { EditContextProvider } from "../contexts/EditContext";

import classes from "./App.module.css";

/**
 * Componente container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <Greeting />
      <ClockContextProvider>
        <ModalNotice />
        <Clock />
        <DateText />
        <CheckpointButton />
        <EditContextProvider>
          <TodayReport />
          <History />
          <ModalEditWrapper />
        </EditContextProvider>
      </ClockContextProvider>
      <BackToTop />
    </main>
  );
};

export default App;
