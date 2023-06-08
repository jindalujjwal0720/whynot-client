import React, { useEffect } from "react";
import useLoading from "../hooks/Loading/useLoading";
import useError from "../hooks/Alert/useError";
import useInfo from "../hooks/Alert/useInfo";
import useServer from "./../hooks/useServer";
import { useAuth } from "./AuthContext";
import useLocalStorage from "../hooks/utils/useLocalStorage";
import Comments from "../components/Comments/Comments";
import useBottomModal from "../hooks/BottomModal/useBottomModal";

const CommentsContext = React.createContext();

export const useComments = () => {
  return React.useContext(CommentsContext);
};

const CommentsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading, Loading] = useLoading(false);
  const [error, setError, Error] = useError();
  const [info, setInfo, Info] = useInfo();
  const [comments, setComments] = React.useState([]);
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const {
    getIssueComments,
    commentIssue,
    upvoteComment: upvoteCommentOnServer,
    downvoteComment: downvoteCommentOnServer,
    reportComment: reportCommentOnServer,
  } = useServer().apiFunctions;
  const [issue, setIssue] = React.useState(null);
  const [hasMore, setHasMore] = React.useState(true);
  const [lastComment, setLastComment] = React.useState(null);
  const [openComments, closeComments, CommentsModal] = useBottomModal();

  useEffect(() => {
    setComments([]);
    setHasMore(true);
    setLastComment(null);
    loadComments(true);
    return () => {
      setComments([]);
      setHasMore(true);
      setLastComment(null);
    };
  }, [issue]);

  useEffect(() => {
    if (issue && hasMore) {
      loadComments();
    } else if (!hasMore) {
      setInfo("No more comments to show");
    }
  }, [lastComment]);

  const loadComments = async () => {
    if (!issue) return;
    setLoading(true);
    // load comments from server with pagination
    return getIssueComments({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: issue,
      limit: 10,
      lastComment: lastComment,
    })
      .then((res) => {
        if (!res || res.length === 0) {
          // if (lastComment) setInfo("No more comments to show");
          // else setInfo("No comments to show");
          setHasMore(false);
          return;
        }
        if (res.length < 10) setHasMore(false);
        setComments((prevComments) => [...prevComments, ...res]);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createComment = async (iss, comment) => {
    setLoading(true);
    return commentIssue({
      uid: currentUser.uid,
      email: currentUser.email,
      issue: iss,
      content: comment,
    })
      .then((res) => {
        setInfo("Comment created");
        return res;
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const hasBookmarked = (comment) => {
    const savedBookmarks = getFromLocalStorage("bookmarks");
    if (savedBookmarks && savedBookmarks.comments) {
      const bookmark = savedBookmarks.comments.find(
        (b) => b._id === comment._id
      );
      if (bookmark) {
        return true;
      }
    }
    return false;
  };

  const handleBookmark = (comment, issue) => {
    let savedBookmarks = getFromLocalStorage("bookmarks");
    if (savedBookmarks && savedBookmarks.comments) {
      if (hasBookmarked(comment)) {
        savedBookmarks.comments = savedBookmarks.comments.filter(
          (b) => b._id !== comment._id
        );
        setToLocalStorage("bookmarks", savedBookmarks);
        return false;
      } else {
        savedBookmarks.comments.push({
          ...comment,
          issue: issue,
        });
        setToLocalStorage("bookmarks", savedBookmarks);
      }
    } else {
      savedBookmarks = {
        ...(savedBookmarks || {}),
        comments: [
          {
            ...comment,
            issue: issue,
          },
        ],
      };
      setToLocalStorage("bookmarks", savedBookmarks);
    }
    return true;
  };

  const upvoteComment = async (comment) => {
    if (comment.hasUpvoted) return comment;
    return upvoteCommentOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      comment: comment,
    })
      .then((res) => {
        setComments((prev) =>
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

  const downvoteComment = async (comment) => {
    if (comment.hasDownvoted) return comment;
    return downvoteCommentOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      comment: comment,
    })
      .then((res) => {
        setComments((prev) =>
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

  const reportComment = async (comment) => {
    if (comment.reports?.includes(currentUser._id) || comment.hasReported) {
      setInfo("You have already reported this comment");
      return comment;
    }
    return reportCommentOnServer({
      uid: currentUser.uid,
      email: currentUser.email,
      comment: comment,
    })
      .then((res) => {
        setComments((prev) =>
          prev.map((i) => {
            if (i._id === res._id) {
              return res;
            }
            return i;
          })
        );
        setInfo("Comment reported successfully");
        return res;
      })
      .catch((err) => {
        setError(err);
      });
  };

  const value = {
    loading,
    hasMore,
    comments,
    issue,
    setIssue,
    lastComment,
    setLastComment,
    openComments,
    closeComments,
    loadComments,
    createComment,
    hasBookmarked,
    handleBookmark,
    upvoteComment,
    downvoteComment,
    reportComment,
  };

  return (
    <CommentsContext.Provider value={value}>
      <Error />
      <Loading />
      <Info />
      <CommentsModal>
        <Comments issue={issue} />
      </CommentsModal>
      {children}
    </CommentsContext.Provider>
  );
};

export default CommentsProvider;
