import ModalBase from "./ModalBase";
import PrimaryButton from "./PrimaryButton";

import classes from "./ModalNotice.module.css";

type Props = {
  children: string | string[];
  closeModal: () => void;
};

const ModalNotice = ({ children, closeModal }: Props) => {
  return (
    <ModalBase closeModal={closeModal}>
      <section className={`bg-neutral-white ${classes.container}`}>
        <p className="neutral-dark">{children}</p>
        <PrimaryButton onClick={closeModal}>OK</PrimaryButton>
      </section>
    </ModalBase>
  );
};

export default ModalNotice;
