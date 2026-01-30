import Greeting from "./Greeting";
import Clock from "./clock/Clock";
import DateText from "./DateText";
import CheckpointButton from "./checkpoint/CheckpointButton";
import TodayReport from "./TodayReport";
import History from "./History";
import ModalNotice from "./modal/ModalNotice";
import BackToTop from "./BackToTop";

import { ClockContextProvider } from "../contexts/ClockContext";
import { EditContextProvider } from "../contexts/EditContext";

import classes from "./App.module.css";
import ModalEdit from "./modal/ModalEdit";

/**
 * Container da aplicação
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
          <ModalEdit />
        </EditContextProvider>
      </ClockContextProvider>
      <BackToTop />
    </main>
  );
};

export default App;
