import { useEffect, type MouseEvent, type PropsWithChildren } from "react";

import classes from "./ModalBase.module.css";

type Props = PropsWithChildren & {
  closeModal: () => void;
  zIndex: number;
};

const ModalBase = ({ children, closeModal, zIndex }: Props) => {
  const handleClick = ({ target }: MouseEvent<HTMLDivElement>) => {
    if (
      target instanceof HTMLDivElement &&
      target.style.zIndex === zIndex.toString()
    ) {
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
      style={{ zIndex }}
    >
      {children}
    </div>
  );
};

export default ModalBase;
