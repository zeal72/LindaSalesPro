import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./Layout/Auth";
import DashboardLayout from "./Layout/DashboardLayout";
import Loader from "./components/Loader";
import { auth, db } from "./../Firebase.config";
import { ref, set, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import OffersPage from "././pages/OffersPage";
import LeadsPage from "./pages/LeadsPage";
import CustomersPage from "./pages/CustomersPage";
import LeadGenPage from "./pages/LeadGenPage";
import MessagingPage from "./pages/MessagingPage";
import AppointmentPage from "./pages/AppointmentPage";
import HelpPage from "./pages/HelpPage";
import SellPage from "./pages/SellPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Check if user exists in database
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            // User exists, get their data
            const userData = snapshot.val();
            setUserInfo(userData);
          } else {
            // New user, create entry
            const userData = {
              uid: user.uid,
              name: user.displayName || "User",
              email: user.email,
              photoURL: user.photoURL || "",
              createdAt: new Date().toISOString()
            };

            await set(userRef, userData);
            setUserInfo(userData);
            toast.success("Profile created successfully!");
          }

          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error fetching your profile. Please try again.");
        }
      } else {
        // User is signed out
        setIsAuthenticated(false);
        setUserInfo(null);
      }

      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle manual login/signup from AuthPage
  const handleLogin = async (user) => {
    setIsLoading(true);

    try {
      if (user) {
        // Save user info to Firebase Realtime Database
        const userRef = ref(db, `users/${user.uid}`);

        // Check if this user already exists
        const snapshot = await get(userRef);
        const isNewUser = !snapshot.exists();

        const userData = {
          uid: user.uid,
          name: user.displayName || user.name || "User",
          email: user.email,
          photoURL: user.photoURL || "",
          lastLogin: new Date().toISOString()
        };

        // If new user, add creation timestamp
        if (isNewUser) {
          userData.createdAt = new Date().toISOString();
        }

        await set(userRef, userData);
        setUserInfo(userData);
        setIsAuthenticated(true);

        // Show appropriate toast message
        if (isNewUser) {
          toast.success("Account created successfully! Welcome to LindasalesPro!");
        } else {
          toast.success("Welcome back!");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await auth.signOut();
      setIsAuthenticated(false);
      setUserInfo(null);
      toast.info("You've been logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900 w-[100vw] h-[100vh] overflow-hidden">
        <div className="text-center">
          <Loader color="#FF9900" size="xl" />
          <p className="mt-4 text-gray-600 font-medium">Loading LindasalesPro...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public route for authentication */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage onLogin={handleLogin} />}
        />

        {/* Protected routes - all dashboard views */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <OffersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <LeadsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <CustomersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lead-gen"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <LeadGenPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messaging"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <MessagingPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <AppointmentPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <HelpPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <SellPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route for 404 */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <DashboardLayout userInfo={userInfo} onLogout={handleLogout}>
                <NotFoundPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;