import { type ButtonHTMLAttributes } from "react";

import classes from "./PrimaryButton.module.css";
import { useClockContext } from "../contexts/ClockContext";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: string | string[];
};

const PrimaryButton = ({ children, className, ...props }: Props) => {
  const { inActivity } = useClockContext();

  return (
    <button
      className={`text-large neutral-white ${classes.button} ${inActivity ? classes.activity : ""} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
