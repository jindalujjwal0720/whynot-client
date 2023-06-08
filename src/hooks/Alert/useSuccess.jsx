import React, { useEffect } from "react";
import AlertPopup from "./Alert";

const useSuccess = () => {
  const [success, setSuccess] = React.useState(null);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    }
  }, [success]);

  return [
    success,
    setSuccess,
    () => success && <AlertPopup message={success} type="success" />,
  ];
};

export default useSuccess;
