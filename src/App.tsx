import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/OwnerLogin";
import Register from "./features/auth/pages/OwnerRegister";
import TenantLogin from "./features/auth/pages/TenantLogin";
import TenantRegister from "./features/auth/pages/TenantRegister";
import Dashboard from "./features/auth/pages/Dashboard";
// import TenantDashboard from "./features/auth/pages/TenantDashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initializeAuth } from "./features/auth/authSlice";
import { ErrorProvider, useError } from "./context/ErrorContext";
import ExplorePGsPage from "./features/dashboard/pages/ExplorePage";
import OwnerLandingPage from "./features/landingPages/pages/OwnerLandingpage";
import TenantLandingPage from "./features/landingPages/pages/TenantLandingPage/TenantLandingPage";

const APP_TYPE = import.meta.env.MODE || "owner"; // 'owner' or 'tenant'
console.log("Current APP_TYPE:", APP_TYPE);
console.log("All env vars:", import.meta.env.MODE);

const GlobalErrorBar = () => {
  const { error, setError } = useError();
  if (!error) return null;
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-red-600 text-white p-3 flex justify-between items-center">
      <span>{error}</span>
      <button
        className="ml-4 px-2 py-1 bg-red-800 rounded"
        onClick={() => setError(null)}
      >
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

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (loading) {
    console.log("Still loading cookies, hold your horses...");
    return null;
  }

  // Render different apps based on APP_TYPE
  if (APP_TYPE === "tenant") {
    return <TenantApp />;
  }

  return <OwnerApp />;
}

function OwnerApp() {
  return (
    <>
      <GlobalErrorBar />
      <Router>
        <Routes>
          <Route path="/" element={<OwnerLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <ExplorePGsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </>
  );
}

function TenantApp() {
  return (
    <>
      <GlobalErrorBar />
      <Router>
        <Routes>
          <Route path="/" element={<TenantLandingPage />} />
          <Route path="/login" element={<TenantLogin />} />
          <Route path="/signUp" element={<TenantRegister />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <ExplorePGsPage />
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
