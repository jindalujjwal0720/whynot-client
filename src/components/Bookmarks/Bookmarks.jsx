import React from "react";
import styles from "./Bookmarks.module.css";
import useLocalStorage from "../../hooks/utils/useLocalStorage";
import { timeSince } from "../../utils/datetime";
import { useFeed } from "../../contexts/FeedContext";
import { useCures } from "../../contexts/CuresContext";
import { useComments } from "../../contexts/CommentsContext";

const Bookmarks = () => {
  const [issues, setIssues] = React.useState([]);
  const [cures, setCures] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  const { getFromLocalStorage } = useLocalStorage();
  const [active, setActive] = React.useState("issues");
  const { categories, handleBookmark: handleIssueBookmark } = useFeed();
  const { handleBookmark: handleCureBookmark } = useCures();
  const { handleBookmark: handleCommentBookmark } = useComments();

  const handleActive = (e) => {
    setActive(e.target.innerText.toLowerCase());
  };

  React.useEffect(() => {
    const bookmarks = getFromLocalStorage("bookmarks");
    if (bookmarks) {
      setIssues(bookmarks.issues);
      setCures(bookmarks.cures);
      setComments(bookmarks.comments);
    }
  }, []);

  const getColor = (category) => {
    const n = categories?.length;
    const index = categories?.indexOf(category);
    const hue = (index * (360 / n)) % 360;
    return `hsl(${hue}, 100%, 35%)`;
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
              {tags[index] && <span className={styles.tag}>{tags[index]}</span>}
            </React.Fragment>
          ))}
        </p>
      );
    }
    return <p className={styles.description}>{text}</p>;
  };

  return (
    <div className={styles.bookmarks}>
      <h2>Bookmarks</h2>
      <div className={styles.nav}>
        <div
          className={
            styles.item + " " + (active === "issues" ? styles.active : "")
          }
          onClick={handleActive}
        >
          Issues
        </div>
        <div
          className={
            styles.item + " " + (active === "cures" ? styles.active : "")
          }
          onClick={handleActive}
        >
          Cures
        </div>
        <div
          className={
            styles.item + " " + (active === "comments" ? styles.active : "")
          }
          onClick={handleActive}
        >
          Comments
        </div>
      </div>
      <div className={styles.content}>
        {active === "issues" &&
          issues.map((issue) => (
            <div className={styles.issue} key={issue._id}>
              <span
                className={styles.category}
                style={{ color: getColor(issue.category) }}
              >
                <span
                  className={styles.circle}
                  style={{ backgroundColor: getColor(issue.category) }}
                ></span>
                {issue.category}
              </span>
              <div className={styles.title}>{issue.title}</div>
              {extractTagsAndReturnHTML(issue.description)}
              <div
                className={styles.remove}
                onClick={() => handleIssueBookmark(issue)}
              >
                Remove
              </div>
            </div>
          ))}
        {active === "cures" &&
          cures.map((cure) => (
            <div className={styles.cure} key={cure._id}>
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
                    <span className={styles.extra}>
                      {timeSince(cure.createdAt)}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.remove}
                  onClick={() => handleCureBookmark(cure)}
                >
                  Remove
                </div>
              </div>
              <div className={styles.content}>{cure.content}</div>
              <div className={styles.issue}>
                <span
                  className={styles.category}
                  style={{ color: getColor(cure.issue.category) }}
                >
                  <span
                    className={styles.circle}
                    style={{ backgroundColor: getColor(cure.issue.category) }}
                  ></span>
                  {cure.issue.category}
                </span>
                <div className={styles.title}>{cure.issue.title}</div>
              </div>
            </div>
          ))}
        {active === "comments" &&
          comments.map((comment) => (
            <div className={styles.comment} key={comment._id}>
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
                    <span className={styles.extra}>
                      {timeSince(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.remove}
                  onClick={() => handleCommentBookmark(comment)}
                >
                  Remove
                </div>
              </div>
              <div className={styles.content}>{comment.content}</div>
              <div className={styles.issue}>
                <span
                  className={styles.category}
                  style={{ color: getColor(comment.issue.category) }}
                >
                  <span
                    className={styles.circle}
                    style={{
                      backgroundColor: getColor(comment.issue.category),
                    }}
                  ></span>
                  {comment.issue.category}
                </span>
                <div className={styles.title}>{comment.issue.title}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Bookmarks;
