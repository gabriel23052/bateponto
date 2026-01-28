import { useEditContext } from "../contexts/EditContext";

import ModalEdit from "./ModalEdit";

const ModalEditWrapper = () => {
  const { inEditionReport } = useEditContext();

  if (!inEditionReport) return null;
  return <ModalEdit />;
};

export default ModalEditWrapper;
