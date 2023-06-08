import React, { useEffect } from "react";
import styles from "./Header.module.css";
import { useFeed } from "../../contexts/FeedContext";
import { useAuth } from "../../contexts/AuthContext";
import useBottomModal from "../../hooks/BottomModal/useBottomModal";
import Bookmarks from "../Bookmarks/Bookmarks";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { handleSearchChange } = useFeed();
  const [search, setSearch] = React.useState("");
  const [dropdown, setDropdown] = React.useState(false);
  const [showBookmarks, hideBookmarks, BookmarksModal] = useBottomModal();

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleOutsideClick = (e) => {
    if (e.target.closest(`.${styles.avatar}`)) return;
    setDropdown(false);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  useEffect(() => {
    const debounceId = setTimeout(() => {
      handleSearchChange(search);
    }, 1000);

    return () => {
      clearTimeout(debounceId);
    };
  }, [search]);

  const handleTheme = () => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <div className={styles.header}>
      <BookmarksModal>
        <Bookmarks />
      </BookmarksModal>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <img
              src={process.env.REACT_APP_LOGO_FULL_URL}
              alt="logo"
              draggable={false}
              referrerPolicy="no-referrer"
            />
            <img
              src={process.env.REACT_APP_LOGO_URL}
              alt="logo"
              draggable={false}
              referrerPolicy="no-referrer"
            />
          </div>
          <input type="search" placeholder="# Search" onChange={handleChange} />
        </div>
        <div className={styles.right}>
          <div className={styles.actions}>
            <div className={styles.action} onClick={showBookmarks}>
              <span>Bookmarks</span>
            </div>
          </div>
          <div className={styles.avatar} onClick={handleDropdown}>
            <img
              src={currentUser.photoURL}
              alt="logo"
              referrerPolicy="no-referrer"
              draggable={false}
            />
            {dropdown && (
              <div className={styles.dropdown}>
                <div className={styles.item} onClick={showBookmarks}>
                  <span>Bookmarks</span>
                </div>
                <div className={styles.item} onClick={handleTheme}>
                  <span>Toggle theme</span>
                </div>
                <div className={styles.item} onClick={logout}>
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
