import React from "react";
import styles from "./CreateIssue.module.css";
import { useFeed } from "../../contexts/FeedContext";
import { useAuth } from "../../contexts/AuthContext";

const CreateIssue = () => {
  const { currentUser } = useAuth();
  const { categories, createIssue } = useFeed();
  const [issue, setIssue] = React.useState({
    title: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    const newIssue = { ...issue, [e.target.name]: e.target.value };
    // replace all html tags with empty string
    newIssue.title = newIssue.title.replace(/(<([^>]+)>)/gi, "");
    newIssue.description = newIssue.description.replace(/(<([^>]+)>)/gi, "");
    // replace all multiple spaces with single space
    newIssue.title = newIssue.title.replace(/\s\s+/g, " ");
    newIssue.description = newIssue.description.replace(/\s\s+/g, " ");
    // replace multiple new lines with single new line and tab
    newIssue.title = newIssue.title.replace(/\n\s*\n/g, "\n\n");
    newIssue.description = newIssue.description.replace(/\n\s*\n/g, "\n\n");
    // replace all gribrish characters with empty string
    newIssue.title = newIssue.title.replace(/[^\x00-\x7F]/g, "");
    newIssue.description = newIssue.description.replace(/[^\x00-\x7F]/g, "");
    // replace all html entities with empty string
    newIssue.title = newIssue.title.replace(/&.*;/g, "");
    newIssue.description = newIssue.description.replace(/&.*;/g, "");
    setIssue(newIssue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createIssue(issue);
    setIssue({ title: "", description: "", category: "" });
    e.target.reset();
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <img
          src={currentUser.photoURL}
          alt="logo"
          referrerPolicy="no-referrer"
          draggable={false}
        />
        <p>Have an issue?</p>
      </div>
      <form
        action=""
        className={styles.content}
        onSubmit={handleSubmit}
        noValidate={false}
      >
        <input
          type="text"
          placeholder="In short, what's the issue?"
          minLength={30}
          maxLength={100}
          name="title"
          onChange={handleChange}
          value={issue.title}
        />
        <p>{issue.title.length}/100</p>
        <textarea
          placeholder="Some details about the issue"
          minLength={10}
          maxLength={1000}
          name="description"
          onChange={handleChange}
          value={issue.description}
        />
        <p>{issue.description.length}/1000</p>
        <div className={styles.extras}>
          <div className={styles.categoryGroup}>
            <label htmlFor="category">Category</label>
            <select name="category" id="category" onChange={handleChange}>
              {categories?.map((category) => {
                return (
                  <option value={category} key={category}>
                    {category}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.buttons}>
            <button type="submit" className={styles.publish}>
              Publish
            </button>
            {issue.title.length > 0 || issue.description.length > 0 ? (
              <button
                type="reset"
                className={styles.cancel}
                onClick={(e) => {
                  e.preventDefault();
                  setIssue({ title: "", description: "", category: "" });
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateIssue;
