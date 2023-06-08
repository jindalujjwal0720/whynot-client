import React, { useEffect } from "react";
import useServer from "./../hooks/useServer";
import { useAuth } from "./AuthContext";
import useLoading from "../hooks/Loading/useLoading";
import useError from "../hooks/Alert/useError";
import useSuccess from "../hooks/Alert/useSuccess";
import useInfo from "../hooks/Alert/useInfo";
import useLocalStorage from "../hooks/utils/useLocalStorage";

const FeedContext = React.createContext();

export const useFeed = () => {
  return React.useContext(FeedContext);
};

const FeedProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = React.useState([]);
  const [loading, setLoading, Loading] = useLoading(false);
  const [error, setError, Error] = useError();
  const [success, setSuccess, Success] = useSuccess();
  const [info, setInfo, Info] = useInfo();
  const {
    getIssues,
    getIssueCategories,
    getIssuesWithCategory,
    getIssuesWithTags,
    createIssue: createIssueOnServer,
    upvoteIssue: upvoteIssueOnServer,
    downvoteIssue: downvoteIssueOnServer,
    reportIssue: reportIssueOnServer,
    updateIssue: updateIssueOnServer,
    deleteIssue: deleteIssueOnServer,
  } = useServer().apiFunctions;
  const [categories, setCategories] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState(null);
  const [type, setType] = React.useState(null); // [search, category, all]
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const [lastIssue, setLastIssue] = React.useState(null);
  const [hasMore, setHasMore] = React.useState(true);

  useEffect(() => {
    setIssues([]);
    setHasMore(true);
    setLastIssue(null);
    loadIssues(true);
    return () => {
      setIssues([]);
      setHasMore(true);
      setLastIssue(null);
    };
  }, [category, search, type]);

  useEffect(() => {
    if (hasMore) {
      loadIssues();
    } else if (!hasMore) {
      setInfo("No more issues to show");
    }
  }, [lastIssue]);

  const loadIssues = async (force = false) => {
    if (!hasMore && !force) return;
    setLoading(true);
    // load issues from server with pagination
    if (search) {
      getIssuesWithTags({
        uid: currentUser.uid,
        email: currentUser.email,
        limit: 10,
        lastIssue: lastIssue,
        tags: search.toLowerCase().trim().split(" "),
      })
        .then((res) => {
          if (!res || res.length === 0) {
            setHasMore(false);
            return;
          }
          if (res.length < 10) setHasMore(false);
          setIssues((prevIssues) => [...prevIssues, ...res]);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (category) {
      getIssuesWithCategory({
        uid: currentUser.uid,
        email: currentUser.email,
        limit: 10,
        lastIssue: lastIssue,
        category: category,
      })
        .then((res) => {
          if (!res || res.length === 0) {
            setHasMore(false);
            return;
          }
          if (res.length < 10) setHasMore(false);
          setIssues((prevIssues) => [...prevIssues, ...res]);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (type === "all") {
      getIssues({
        uid: currentUser.uid,
        email: currentUser.email,
        limit: 10,
        lastIssue: lastIssue,
      })
        .then((res) => {
          if (!res || res.length === 0) {
            setHasMore(false);
            return;
          }
          if (res.length < 10) setHasMore(false);
          setIssues((prevIssues) => [...prevIssues, ...res]);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const createIssue = async (data) => {
    if (!data.title || !data.description || !data.category)
      return setError("Please fill all the fields");
    return createIssueOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: data,
    })
      .then((res) => {
        setSuccess("Issue created successfully");
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };

  const handleSearchChange = (q) => {
    q = q.toLowerCase().trim();
    q = q.replace(/\s\s+/g, " ");
    q = q.replace(/[^a-zA-Z0-9 ]/g, "");
    setSearch(q);
  };

  const hasBookmarked = (issue) => {
    const savedBookmarks = getFromLocalStorage("bookmarks");
    if (savedBookmarks && savedBookmarks.issues) {
      const bookmark = savedBookmarks.issues.find((b) => b._id === issue._id);
      if (bookmark) {
        return true;
      }
    }
    return false;
  };

  const handleBookmark = (issue) => {
    let savedBookmarks = getFromLocalStorage("bookmarks");
    if (savedBookmarks && savedBookmarks.issues) {
      if (hasBookmarked(issue)) {
        savedBookmarks.issues = savedBookmarks.issues.filter(
          (b) => b._id !== issue._id
        );
        setToLocalStorage("bookmarks", savedBookmarks);
        return false;
      } else {
        savedBookmarks.issues.push(issue);
        setToLocalStorage("bookmarks", savedBookmarks);
      }
    } else {
      savedBookmarks = {
        ...(savedBookmarks || {}),
        issues: [issue],
      };
      setToLocalStorage("bookmarks", savedBookmarks);
    }
    return true;
  };

  const upvoteIssue = async (issue) => {
    if (issue.hasUpvoted) return issue;
    return upvoteIssueOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: issue,
    })
      .then((res) => {
        const newIssues = issues.map((i) => {
          if (i._id === res._id) {
            return res;
          }
          return i;
        });
        setIssues(newIssues);
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  const downvoteIssue = async (issue) => {
    if (issue.hasDownvoted) return issue;
    return downvoteIssueOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: issue,
    })
      .then((res) => {
        const newIssues = issues.map((i) => {
          if (i._id === res._id) {
            return res;
          }
          return i;
        });
        setIssues(newIssues);
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  const reportIssue = async (issue) => {
    if (issue.hasReported) {
      setInfo("You have already reported this issue");
      return issue;
    }
    return reportIssueOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: issue,
    })
      .then((res) => {
        const newIssues = issues.map((i) => {
          if (i._id === res._id) {
            return res;
          }
          return i;
        });
        setIssues(newIssues);
        setInfo("Issue reported successfully");
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    getIssueCategories({
      uid: currentUser.uid,
      email: currentUser.email,
    })
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  const value = {
    issues,
    loading,
    lastIssue,
    setLastIssue,
    hasMore,
    type,
    setType,
    loadIssues,
    categories,
    createIssue,
    category,
    handleCategoryChange,
    search,
    handleSearchChange,
    handleBookmark,
    hasBookmarked,
    upvoteIssue,
    downvoteIssue,
    reportIssue,
  };

  return (
    <FeedContext.Provider value={value}>
      <Error />
      <Success />
      <Info />
      <Loading />
      {children}
    </FeedContext.Provider>
  );
};

export default FeedProvider;
