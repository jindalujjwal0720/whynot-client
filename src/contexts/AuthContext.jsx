import React from "react";
import { auth, googleAuthProvider } from "./../config/firebase";
import useServer from "./../hooks/useServer";

const AuthContext = React.createContext();

export const useAuth = () => {
  return React.useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { login } = useServer().userFunctions;

  const loginWithGoogle = async () => {
    try {
      return auth
        .signInWithRedirect(googleAuthProvider)
        .then(async (res) => {
          setCurrentUser(res.user);
          await login({
            uid: res.user.uid,
            email: res.user.email,
            name: res.user.displayName,
            photoURL: res.user.photoURL,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    return auth.signOut();
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        login({
          uid: user?.uid,
          email: user?.email,
          name: user?.displayName,
          photoURL: user?.photoURL,
        }).then((res) => {
          user._id = res._id;
          setCurrentUser(user);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
