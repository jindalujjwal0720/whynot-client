import React, { useEffect } from "react";
import LoadingProgress from "./Loading";

const useLoading = (initialValue) => {
  const [loading, setLoading] = React.useState(initialValue);

  return [loading, setLoading, () => (loading ? <LoadingProgress /> : null)];
};

export default useLoading;
