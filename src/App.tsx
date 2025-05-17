import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Dashboard from "./features/auth/pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { setUserFromCookies } from "./features/auth/authSlice";
import { ErrorProvider, useError } from "./context/ErrorContext";

const GlobalErrorBar = () => {
  const { error, setError } = useError();
  if (!error) return null;
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-red-600 text-white p-3 flex justify-between items-center">
      <span>{error}</span>
      <button className="ml-4 px-2 py-1 bg-red-800 rounded" onClick={() => setError(null)}>
        Close
      </button>
    </div>
  );
};

function App() {
  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  );
}

function AppContent() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loadingFromCookies);
  const { setError } = useError();

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
    <>
      <GlobalErrorBar />
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
    </>
  );
}

export default App;
// useAppSelector is now imported from hooks, so this implementation is removed.

