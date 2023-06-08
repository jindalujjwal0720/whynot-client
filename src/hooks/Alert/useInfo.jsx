import React, { useEffect } from "react";
import AlertPopup from "./Alert";

const useInfo = () => {
  const [info, setInfo] = React.useState(null);

  useEffect(() => {
    if (info) {
      setTimeout(() => {
        setInfo(null);
      }, 5000);
    }
  }, [info]);

  return [
    info,
    setInfo,
    () => info && <AlertPopup message={info} type="info" />,
  ];
};

export default useInfo;
