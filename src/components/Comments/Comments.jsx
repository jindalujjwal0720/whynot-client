import React, { useState } from "react";
import styles from "./Comments.module.css";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { timeSince } from "../../utils/datetime";
import { useComments } from "../../contexts/CommentsContext";

const Comments = ({ issue }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const { loading, comments, createComment, setLastComment, hasMore } =
    useComments();
  const observer = React.useRef();
  const lastCommentRef = React.useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLastComment(comments[comments.length - 1]);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content) {
      createComment(issue, content).then(() => {
        setContent("");
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Comments</h2>
      <p>See what people are talking about this issue.</p>
      <div className={styles.comments}>
        {comments.map((comment, index) =>
          index === comments.length - 1 ? (
            <div ref={lastCommentRef} key={comment._id}>
              <CommentComponent comment={comment} key={comment._id} />
            </div>
          ) : (
            <CommentComponent comment={comment} key={comment._id} />
          )
        )}
        {loading && <p>Loading...</p>}
        {!loading && comments.length === 0 && <p>No comments yet.</p>}
      </div>
      <div className={styles.addComment}>
        <div className={styles.avatar}>
          <img
            src={currentUser.photoURL}
            alt="avatar"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className={styles.input}>
          <textarea
            type="text"
            placeholder={`Write your comment here...`}
            onChange={handleContentChange}
          />
        </div>
        <div className={styles.button}>
          <button onClick={handleSubmit}>Publish</button>
        </div>
      </div>
    </div>
  );
};

const CommentComponent = ({ comment }) => {
  const [dropdown, setDropdown] = useState(false);
  const { currentUser } = useAuth();
  const {
    reportComment,
    issue,
    handleBookmark: handleBookmarkProp,
    hasBookmarked: hasBookmarkedProp,
    upvoteComment,
    downvoteComment,
  } = useComments();
  const [hasBookmarked, setHasBookmarked] = useState(
    hasBookmarkedProp(comment, issue)
  );

  const handleBookmark = (e) => {
    e.stopPropagation();
    setHasBookmarked(handleBookmarkProp(comment, issue));
  };

  const handleDropdown = (e) => {
    e.stopPropagation();
    setDropdown(!dropdown);
  };

  const handleReportComment = (e) => {
    e.stopPropagation();
    reportComment(comment);
  };

  const handleOutsideClick = (e) => {
    e.stopPropagation();
    if (e.target.closest(`.${styles.dropdown}`)) return;
    setDropdown(false);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            <img
              src={comment.user.photoURL}
              alt="avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className={styles.name}>{comment.user.name}</span>
            <span className={styles.extra}>{timeSince(comment.createdAt)}</span>
          </div>
        </div>
        <div className={styles.more}>
          <FiMoreHorizontal size={20} onClick={handleDropdown} />
          {dropdown && (
            <div className={styles.dropdown}>
              <div
                className={styles.dropdownItem}
                onClick={handleReportComment}
              >
                <span>{comment.hasReported ? "Reported" : "Report"}</span>
              </div>
              <div className={styles.dropdownItem} onClick={handleBookmark}>
                <span>{hasBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </div>
              {/* {(comment.user === currentUser._id ||
                comment.user.uid === currentUser.uid) && (
                <>
                  <div className={styles.dropdownItem}>
                    <span>Edit</span>
                  </div>
                  <div
                    className={styles.dropdownItem + " " + styles.delete}
                  >
                    <span>Delete</span>
                  </div>
                </>
              )} */}
            </div>
          )}
        </div>
      </div>
      <div className={styles.body}>
        <p>{comment.content}</p>
        <div className={styles.actions}>
          <div
            className={styles.action + " " + styles.upvote}
            onClick={() => upvoteComment(comment)}
          >
            {comment.hasUpvoted ? (
              <AiFillHeart size={20} className={styles.upvoted} />
            ) : (
              <AiOutlineHeart size={20} />
            )}
            <span>{comment.upvotesCount}</span>
          </div>
          <div
            className={styles.action + " " + styles.downvote}
            onClick={() => downvoteComment(comment)}
          >
            {comment.hasDownvoted ? (
              <AiFillDislike size={20} className={styles.downvoted} />
            ) : (
              <AiOutlineDislike size={20} />
            )}
            <span>{comment.downvotesCount}</span>
          </div>
          <div
            className={styles.action + " " + styles.bookmark}
            onClick={handleBookmark}
          >
            {hasBookmarked ? (
              <FaBookmark size={16} />
            ) : (
              <FaRegBookmark size={16} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
