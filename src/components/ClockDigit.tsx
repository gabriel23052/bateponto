import { useEffect, useRef } from "react";

import classes from "./ClockDigit.module.css";

const TRANSITION_DELAY = 500;

type Props = {
  digit: Digit;
};

/**
 * Componente do dígito animado do relógio
 */
const ClockDigit = ({ digit }: Props) => {
  const hiddenCharIndex = useRef<0 | 1>(1);
  const chars = useRef<(HTMLSpanElement | null)[]>([null, null]);
  const previousDigit = useRef<Digit>(digit);
  const firstRender = useRef(true);

  const animate = () => {
    if (chars.current[0] === null || chars.current[1] === null) return;

    const [toShowElement, toHideElement] =
      hiddenCharIndex.current === 1
        ? [chars.current[1], chars.current[0]]
        : [chars.current[0], chars.current[1]];

    toHideElement.style.translate = "-50% 100%";
    toHideElement.style.opacity = "0";

    toShowElement.style.translate = "-50% 0";
    toShowElement.style.opacity = "1";

    setTimeout(() => {
      toHideElement.style.translate = "-50% -100%";
    }, TRANSITION_DELAY);
  };

  useEffect(() => {
    previousDigit.current = digit;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    animate();
    hiddenCharIndex.current = hiddenCharIndex.current === 0 ? 1 : 0;
  }, [digit]);

  return (
    <div className={`text-display ${classes.container}`}>
      <span
        ref={(el) => {
          chars.current[0] = el;
        }}
        className={classes.char0}
      >
        {/* eslint-disable-next-line react-hooks/refs */}
        {hiddenCharIndex.current === 0 ? digit : previousDigit.current}
      </span>
      <span
        ref={(el) => {
          chars.current[1] = el;
        }}
        className={classes.char1}
      >
        {/* eslint-disable-next-line react-hooks/refs */}
        {hiddenCharIndex.current === 1 ? digit : previousDigit.current}
      </span>
    </div>
  );
};

export default ClockDigit;
