import Logo from "./Logo";
import Description from "./Description";
import Clock from "./clock/Clock";
import DateText from "./DateText";
import CheckpointButton from "./checkpoint/CheckpointButton";
import TodayReport from "./TodayReport";
import History from "./History";
import ModalNotice from "./modal/ModalNotice";
import BackToTop from "./BackToTop";
import ModalEdit from "./modal/ModalEdit";

import { ClockContextProvider } from "../contexts/ClockContext";
import { EditContextProvider } from "../contexts/EditContext";

import classes from "./App.module.css";

/**
 * Container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <Logo />
      <Description />
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
