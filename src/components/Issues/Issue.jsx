import React from "react";
import styles from "./Issues.module.css";
import { BiDislike } from "react-icons/bi";
import { LuHeartHandshake } from "react-icons/lu";
import { FiSend } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { TbPuzzle } from "react-icons/tb";
import { FiMoreHorizontal } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useFeed } from "../../contexts/FeedContext";
import { useComments } from "../../contexts/CommentsContext";
import { useCures } from "../../contexts/CuresContext";

const Issue = ({ issue: iss }) => {
  const [issue, setIssue] = React.useState(iss);
  const { currentUser } = useAuth();
  const {
    handleCategoryChange,
    categories,
    handleBookmark: _handleBookmark,
    hasBookmarked: _hasBookmarked,
    upvoteIssue,
    downvoteIssue,
    reportIssue,
    handleSearchChange,
  } = useFeed();
  const [dropdown, setDropdown] = React.useState(false);
  const [hasBookmarked, setHasBookmarked] = React.useState(_hasBookmarked(iss));
  const { openComments, setIssue: setIssueInComments } = useComments();
  const { openCures, setIssue: setIssueInCures } = useCures();

  React.useEffect(() => {
    setIssue(iss);
    setHasBookmarked(_hasBookmarked(iss));
  }, [iss]);

  const handleOpenComments = (e) => {
    e.stopPropagation();
    setIssueInComments(issue);
    openComments();
  };

  const handleOpenCures = (e) => {
    e.stopPropagation();
    setIssueInCures(issue);
    openCures();
  };

  const handleUpvote = (e) => {
    e.stopPropagation();
    upvoteIssue(issue).then((iss) => {
      setIssue(iss);
    });
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    downvoteIssue(issue).then((iss) => {
      setIssue(iss);
    });
  };

  const handleReport = (e) => {
    e.stopPropagation();
    reportIssue(issue).then((iss) => {
      setIssue(iss);
      setDropdown(false);
    });
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setHasBookmarked(_handleBookmark(issue));
  };

  const getColor = (category) => {
    const n = categories?.length;
    const index = categories?.indexOf(category);
    const hue = (index * (360 / n)) % 360;
    return `hsl(${hue}, 100%, 35%)`;
  };

  const handleDropdown = (e) => {
    e.stopPropagation();
    setDropdown(!dropdown);
  };

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: issue.title,
          text: issue.description.substring(0, 100) + "...",
          url: process.env.REACT_APP_CLIENT_URL + "/feed/" + issue._id,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const extractTagsAndReturnHTML = (text) => {
    if (!text) return <p className={styles.description}>No description</p>;
    // replace all html tags with empty string
    text = text.replace(/(<([^>]+)>)/gi, "");
    const regex = /#[a-zA-Z0-9]+/g;
    const matches = text.match(regex);
    if (matches) {
      const splitText = text.split(regex);
      const tags = text.match(regex);
      return (
        <p className={styles.description}>
          {splitText.map((text, index) => (
            <React.Fragment key={index}>
              {text}
              {tags[index] && (
                <span
                  className={styles.tag}
                  onClick={() => handleSearchChange(tags[index].substring(1))}
                >
                  {tags[index]}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      );
    }
    return <p className={styles.description}>{text}</p>;
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
    <div key={issue._id} className={styles.issue}>
      <div className={styles.more}>
        <FiMoreHorizontal size={20} onClick={handleDropdown} />
        {dropdown && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem} onClick={handleReport}>
              <span>{issue.hasReported ? "Reported" : "Report"}</span>
            </div>
            <div className={styles.dropdownItem}>
              <span onClick={share}>Share</span>
            </div>
            <div className={styles.dropdownItem} onClick={handleBookmark}>
              <span>{hasBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </div>
            {/* {(issue.user === currentUser._id ||
              issue.user.uid === currentUser.uid) && (
              <>
                <div className={styles.dropdownItem}>
                  <span>Edit</span>
                </div>
                <div className={styles.dropdownItem + " " + styles.delete}>
                  <span>Delete</span>
                </div>
              </>
            )} */}
          </div>
        )}
      </div>
      <span
        className={styles.category}
        style={{ color: getColor(issue.category) }}
        onClick={() => handleCategoryChange(issue.category)}
      >
        <span
          className={styles.circle}
          style={{ backgroundColor: getColor(issue.category) }}
        ></span>
        {issue.category}
      </span>
      <h3>{issue.title}</h3>
      {extractTagsAndReturnHTML(issue.description)}
      {issue.upvotesCount > 0 && (
        <div className={styles.upvotePhotos}>
          <div className={styles.photos}>
            {issue.upvotes.slice(0, 3).map((photo, index) => (
              <div key={index} className={styles.photo}>
                <img src={photo} alt="upvote" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <span>
            {issue.hasUpvoted
              ? issue.upvotesCount > 1
                ? `You and ${issue.upvotesCount - 1} others`
                : "You support this"
              : `${issue.upvotesCount} supports`}
          </span>
        </div>
      )}
      <div className={styles.actions}>
        <div className={styles.left}>
          <div className={issue.hasUpvoted ? styles.upVoted : ""}>
            <LuHeartHandshake size={22} onClick={handleUpvote} />
            <span>{issue.upvotesCount}</span>
          </div>
          <div className={issue.hasDownvoted ? styles.downVoted : ""}>
            <BiDislike size={22} onClick={handleDownvote} />
            <span>{issue.downvotesCount}</span>
          </div>
          <div className={styles.share} onClick={share}>
            <FiSend size={20} />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.cure}>
            <TbPuzzle size={22} onClick={handleOpenCures} />
          </div>
          <div className={styles.comments}>
            <FaRegComment size={22} onClick={handleOpenComments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issue;
