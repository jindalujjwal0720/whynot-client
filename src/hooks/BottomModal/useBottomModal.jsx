import React from "react";
import styles from "./BottomModal.module.css";

const useBottomModal = (initialState) => {
  const [show, setShow] = React.useState(initialState);
  const modalRef = React.useRef();
  const wrapperRef = React.useRef();

  const open = () => {
    setShow(true);
    modalRef.current?.classList.add(styles.openModal);
    wrapperRef.current?.classList.add(styles.openWrapper);
    setTimeout(() => {
      modalRef.current?.classList.remove(styles.openModal);
      wrapperRef.current?.classList.remove(styles.openWrapper);
    }, 320);
  };

  const close = () => {
    modalRef.current?.classList.add(styles.closeModal);
    wrapperRef.current?.classList.add(styles.closeWrapper);
    setTimeout(() => {
      setShow(false);
    }, 280);
  };

  return [
    open,
    close,
    ({ children }) =>
      show ? (
        <div className={styles.wrapper} ref={wrapperRef}>
          <div className={styles.modal} ref={modalRef}>
            <span className={styles.close} onClick={close}>
              &times;
            </span>
            <div className={styles.content}>{children}</div>
          </div>
        </div>
      ) : null,
  ];
};

export default useBottomModal;
