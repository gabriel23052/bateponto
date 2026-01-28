import type { PropsWithChildren } from "react";

import CloseIcon from "../../assets/icons/close.svg?react";

import classes from "./ModalTitleBar.module.css";

type Props = PropsWithChildren & {
  children: string;
  closeModal: () => void;
};

const ModalTitleBar = ({ children, closeModal }: Props) => {
  return (
    <div className={classes.container}>
      <h2 className="neutral-dark text-default">{children}</h2>
      <button onClick={closeModal}>
        <CloseIcon width={16} height={16} />
      </button>
    </div>
  );
};

export default ModalTitleBar;

