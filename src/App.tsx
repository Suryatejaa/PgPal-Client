import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Dashboard from "./features/auth/pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { setUserFromCookies } from "./features/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loadingFromCookies);

  useEffect(() => {
    console.log("App useEffect: dispatching setUserFromCookies");
    dispatch(setUserFromCookies());
  }, [dispatch]);

  // if (loading) return <div className="w-full text-center py-10">Loading...</div>;

  if (loading) {
    console.log("Still loading cookies, hold your horses...");
    return null; // or show a spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
// useAppSelector is now imported from hooks, so this implementation is removed.

