import LogoSVG from "../assets/logo.svg?react";

import classes from "./Logo.module.css";

const Logo = () => {
  return (
    <LogoSVG
      width={200}
      className={classes.logo}
      title="BatePonto"
    />
  );
};

export default Logo;

