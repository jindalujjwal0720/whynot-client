import React, { useEffect } from "react";
import AlertPopup from "./Alert";

const useError = () => {
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return [
    error,
    setError,
    () => error && <AlertPopup message={error} type="error" />,
  ];
};

export default useError;
