import React, { useState } from "react";
import styles from "./Cures.module.css";
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
import { useCures } from "../../contexts/CuresContext";

const Cures = ({ issue }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const { loading, cures, createCure, setLastCure, hasMore } = useCures();
  const observer = React.useRef();
  const lastCureRef = React.useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLastCure(cures[cures.length - 1]);
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
      createCure(issue, content).then(() => {
        setContent("");
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Cures</h2>
      <p>See what ideas people have regarding this issue.</p>
      <div className={styles.cures}>
        {cures.map((cure, index) =>
          index === cures.length - 1 ? (
            <div ref={lastCureRef} key={cure._id}>
              <CureComponent cure={cure} key={cure._id} />
            </div>
          ) : (
            <CureComponent cure={cure} key={cure._id} />
          )
        )}
        {loading && <p>Loading...</p>}
        {!loading && cures.length === 0 && <p>No cures yet.</p>}
      </div>
      <div className={styles.addCure}>
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
            placeholder={`Write your cure here...`}
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

const CureComponent = ({ cure }) => {
  const [dropdown, setDropdown] = useState(false);
  const { currentUser } = useAuth();
  const {
    reportCure,
    issue,
    handleBookmark: handleBookmarkProp,
    hasBookmarked: hasBookmarkedProp,
    upvoteCure,
    downvoteCure,
  } = useCures();
  const [hasBookmarked, setHasBookmarked] = useState(
    hasBookmarkedProp(cure, issue)
  );

  const handleBookmark = (e) => {
    e.stopPropagation();
    setHasBookmarked(handleBookmarkProp(cure, issue));
  };

  const handleDropdown = (e) => {
    e.stopPropagation();
    setDropdown(!dropdown);
  };

  const handleReportCure = (e) => {
    e.stopPropagation();
    reportCure(cure);
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
    <div className={styles.cure}>
      <div className={styles.header}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            <img
              src={cure.user.photoURL}
              alt="avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className={styles.name}>{cure.user.name}</span>
            <span className={styles.extra}>{timeSince(cure.createdAt)}</span>
          </div>
        </div>
        <div className={styles.more}>
          <FiMoreHorizontal size={20} onClick={handleDropdown} />
          {dropdown && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={handleReportCure}>
                <span>{cure.hasReported ? "Reported" : "Report"}</span>
              </div>
              <div className={styles.dropdownItem} onClick={handleBookmark}>
                <span>{hasBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </div>
              {/* {(cure.user === currentUser._id ||
                cure.user.uid === currentUser.uid) && (
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
        <p>{cure.content}</p>
        <div className={styles.actions}>
          <div
            className={styles.action + " " + styles.upvote}
            onClick={() => upvoteCure(cure)}
          >
            {cure.hasUpvoted ? (
              <AiFillHeart size={20} className={styles.upvoted} />
            ) : (
              <AiOutlineHeart size={20} />
            )}
            <span>{cure.upvotesCount}</span>
          </div>
          <div
            className={styles.action + " " + styles.downvote}
            onClick={() => downvoteCure(cure)}
          >
            {cure.hasDownvoted ? (
              <AiFillDislike size={20} className={styles.downvoted} />
            ) : (
              <AiOutlineDislike size={20} />
            )}
            <span>{cure.downvotesCount}</span>
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

export default Cures;
