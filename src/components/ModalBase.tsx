import { useEffect, type MouseEvent, type PropsWithChildren } from "react";

import classes from "./ModalBase.module.css";

type Props = PropsWithChildren & {
  closeModal: () => void;
};

const ModalBase = ({ children, closeModal }: Props) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.dataset.iscontainer) {
      closeModal();
    }
  };

  useEffect(() => {
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", keyboardHandler);
    return () => {
      document.removeEventListener("keydown", keyboardHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classes.container}
      onClick={handleClick}
      data-iscontainer="true"
    >
      {children}
    </div>
  );
};

export default ModalBase;
