import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/Login";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<PrivateRoute />}>
            <Route path="" element={<Navigate to="/feed" />} />
            <Route path="feed" element={<Feed />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
