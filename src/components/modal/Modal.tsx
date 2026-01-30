import { createPortal } from "react-dom";

import { useEffect, useRef, type PropsWithChildren } from "react";

import classes from "./Modal.module.css";

type Props = PropsWithChildren & {
  className?: string;
  close: () => void;
};

/**
 * Wrapper reutilizável para modal, exibe o fundo desfocado 
 * e controla fechamento e foco do modal
 * @param children Conteúdo do modal
 * @param className Classe(s) do container do modal
 * @param close Callback que deve ser executado para fechar o modal
 */
const Modal = ({ children, className, close }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const ignoreCloseRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      ignoreCloseRef.current = true;
      dialog.close();
    };
  }, []);

  const handleClose = () => {
    if (ignoreCloseRef.current) {
      ignoreCloseRef.current = false;
      return;
    }
    close();
  };

  return createPortal(
    <dialog
      className={classes.container + " " + className}
      onClose={handleClose}
      ref={dialogRef}
      closedby="any"
    >
      {children}
    </dialog>,
    document.body,
  );
};

export default Modal;

