import React, { useEffect } from "react";
import useLoading from "../hooks/Loading/useLoading";
import useError from "../hooks/Alert/useError";
import useInfo from "../hooks/Alert/useInfo";
import useServer from "./../hooks/useServer";
import { useAuth } from "./AuthContext";
import useLocalStorage from "../hooks/utils/useLocalStorage";
import Cures from "../components/Cures/Cures";
import useBottomModal from "../hooks/BottomModal/useBottomModal";

const CuresContext = React.createContext();

export const useCures = () => {
  return React.useContext(CuresContext);
};

const CuresProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading, Loading] = useLoading(false);
  const [error, setError, Error] = useError();
  const [info, setInfo, Info] = useInfo();
  const [cures, setCures] = React.useState([]);
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const {
    getIssueCures,
    cureIssue,
    upvoteCure: upvoteCureOnServer,
    downvoteCure: downvoteCureOnServer,
    reportCure: reportCureOnServer,
  } = useServer().apiFunctions;
  const [issue, setIssue] = React.useState(null);
  const [hasMore, setHasMore] = React.useState(true);
  const [lastCure, setLastCure] = React.useState(null);
  const [openCures, closeCures, CuresModal] = useBottomModal();

  useEffect(() => {
    setCures([]);
    setHasMore(true);
    setLastCure(null);
    loadCures(true);
    return () => {
      setCures([]);
      setHasMore(true);
      setLastCure(null);
    };
  }, [issue]);

  useEffect(() => {
    if (issue && hasMore) {
      loadCures();
    } else if (!hasMore) {
      setInfo("No more cures to show");
    }
  }, [lastCure]);

  const loadCures = async () => {
    if (!issue) return;
    setLoading(true);
    // load cures from server with pagination
    return getIssueCures({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: issue,
      limit: 10,
      lastCure: lastCure,
    })
      .then((res) => {
        if (!res || res.length === 0) {
        //   if (lastCure) setInfo("No more cures to show");
        //   else setInfo("No cures to show");
          setHasMore(false);
          return;
        }
        if (res.length < 10) setHasMore(false);
        setCures((prevCures) => [...prevCures, ...res]);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createCure = async (iss, cure) => {
    setLoading(true);
    return cureIssue({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: iss,
      content: cure,
    })
      .then((res) => {
        setInfo("Cure created");
        return res;
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const hasBookmarked = (cure) => {
    const savedBookmarks = getFromLocalStorage("bookmarks");
    if (savedBookmarks && savedBookmarks.cures) {
      const bookmark = savedBookmarks.cures.find((b) => b._id === cure._id);
      if (bookmark) {
        return true;
      }
    }
    return false;
  };

  const handleBookmark = (cure, issue) => {
    let savedBookmarks = getFromLocalStorage("bookmarks");
    if (savedBookmarks && savedBookmarks.cures) {
      if (hasBookmarked(cure)) {
        savedBookmarks.cures = savedBookmarks.cures.filter(
          (b) => b._id !== cure._id
        );
        setToLocalStorage("bookmarks", savedBookmarks);
        return false;
      } else {
        savedBookmarks.cures.push({
          ...cure,
          issue: issue,
        });
        setToLocalStorage("bookmarks", savedBookmarks);
      }
    } else {
      savedBookmarks = {
        ...(savedBookmarks || {}),
        cures: [
          {
            ...cure,
            issue: issue,
          },
        ],
      };
      setToLocalStorage("bookmarks", savedBookmarks);
    }
    return true;
  };

  const upvoteCure = async (cure) => {
    if (cure.hasUpvoted) return cure;
    return upvoteCureOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      cure: cure,
    })
      .then((res) => {
        setCures((prev) =>
          prev.map((i) => {
            if (i._id === res._id) {
              return res;
            }
            return i;
          })
        );
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  const downvoteCure = async (cure) => {
    if (cure.hasDownvoted) return cure;
    return downvoteCureOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      cure: cure,
    })
      .then((res) => {
        setCures((prev) =>
          prev.map((i) => {
            if (i._id === res._id) {
              return res;
            }
            return i;
          })
        );
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  const reportCure = async (cure) => {
    if (cure.reports?.includes(currentUser._id) || cure.hasReported) {
      setInfo("You have already reported this cure");
      return cure;
    }
    return reportCureOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      cure: cure,
    })
      .then((res) => {
        setCures((prev) =>
          prev.map((i) => {
            if (i._id === res._id) {
              return res;
            }
            return i;
          })
        );
        setInfo("Cure reported successfully");
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  const value = {
    loading,
    hasMore,
    cures,
    issue,
    setIssue,
    lastCure,
    setLastCure,
    openCures,
    closeCures,
    loadCures,
    createCure,
    hasBookmarked,
    handleBookmark,
    upvoteCure,
    downvoteCure,
    reportCure,
  };

  return (
    <CuresContext.Provider value={value}>
      <Error />
      <Loading />
      <Info />
      <CuresModal>
        <Cures issue={issue} />
      </CuresModal>
      {children}
    </CuresContext.Provider>
  );
};

export default CuresProvider;
