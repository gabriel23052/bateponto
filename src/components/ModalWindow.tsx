import type { PropsWithChildren } from "react";

import CloseIcon from "../assets/icons/close.svg?react";

import classes from "./ModalWindow.module.css";

type Props = PropsWithChildren & {
  title: string;
  closeModal: () => void;
};

const ModalWindow = ({ children, title, closeModal }: Props) => {
  return (
    <div className={classes.container}>
      <div className={`bg-neutral-dark ${classes.titleBar}`}>
        <h2 className="neutral-white text-large">{title}</h2>
        <button onClick={closeModal}>
          <CloseIcon width={16} height={16} />
        </button>
      </div>
      {children}
    </div>
  );
};

export default ModalWindow;

