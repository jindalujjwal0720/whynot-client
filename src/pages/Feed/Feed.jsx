import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Feed.module.css";
import Header from "../../components/Header/Header";
import FeedProvider from "../../contexts/FeedContext";
import CreateIssue from "../../components/CreateIssue/CreateIssue";
import Issues from "../../components/Issues/Issues";
import CommentsProvider from "../../contexts/CommentsContext";
import CuresProvider from "../../contexts/CuresContext";

const Feed = () => {
  const { currentUser } = useAuth();
  return (
    <div className={styles.feedPage}>
      <FeedProvider>
        <CommentsProvider>
          <CuresProvider>
            <Header />
            <div className={styles.feed}>
              <CreateIssue />
              <Issues />
            </div>
          </CuresProvider>
        </CommentsProvider>
      </FeedProvider>
    </div>
  );
};

export default Feed;
