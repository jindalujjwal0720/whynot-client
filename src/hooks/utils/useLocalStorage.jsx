import CryptoJS from "crypto-js";

const useLocalStorage = () => {
  const S3CR37_K3Y = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY;
  const getFromLocalStorage = (key) => {
    const hashedKey = CryptoJS.SHA256(key).toString();
    const encryptedValue = localStorage.getItem(hashedKey);
    if (encryptedValue) {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, S3CR37_K3Y);
      const decryptedValue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedValue;
    }
    return null;
  };

  const setToLocalStorage = (key, value) => {
    const hashedKey = CryptoJS.SHA256(key).toString();
    const encryptedValue = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      S3CR37_K3Y
    ).toString();
    localStorage.setItem(hashedKey, encryptedValue);
  };

  const removeFromLocalStorage = (key) => {
    const hashedKey = CryptoJS.SHA256(key).toString();
    localStorage.removeItem(hashedKey);
  };

  return { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage };
};

export default useLocalStorage;
