import React from "react";
import styles from "./Issues.module.css";
import { useFeed } from "../../contexts/FeedContext";
import Issue from "./Issue";

const Issues = () => {
  const {
    issues,
    categories,
    handleCategoryChange,
    category: activeCategory,
    search,
    loading,
    hasMore,
    setType: setIssuesType,
    setLastIssue,
  } = useFeed();
  const observer = React.useRef();
  const lastIssueRef = React.useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLastIssue(issues[issues.length - 1]);
          console.log("last issue");
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  React.useEffect(() => {
    setIssuesType("all");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        <div
          className={
            styles.category + " " + (!activeCategory ? styles.selected : "")
          }
          onClick={() => handleCategoryChange(null)}
        >
          <span>All</span>
        </div>
        {!search &&
          categories?.map((category) => {
            return (
              <div
                key={category}
                className={
                  styles.category +
                  " " +
                  (activeCategory === category ? styles.selected : "")
                }
                onClick={() => handleCategoryChange(category)}
              >
                <span>{category}</span>
              </div>
            );
          })}
      </div>
      {search && (
        <p className={styles.searchQuery}>
          Showing issues related to the search results of{" "}
          {search?.split(" ").map((word) => {
            return (
              <span key={word} class={styles.tag}>
                {word + " "}
              </span>
            );
          })}
        </p>
      )}
      <div className={styles.content}>
        {issues?.map((issue, index) => {
          return index === issues.length - 1 ? (
            <div ref={lastIssueRef} key={issue._id}>
              <Issue issue={issue} key={issue._id} />
            </div>
          ) : (
            <Issue issue={issue} key={issue._id} />
          );
        })}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && issues.length === 0 && <p>No issues found.</p>}
    </div>
  );
};

export default Issues;
