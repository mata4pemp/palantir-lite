import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import Homepage from "./Homepage/Homepage";
import NewChat from "./NewChat/Newchat";
import MyChats from "./MyChats/Mychats";
import Billing from "./BillingPage/Billing";
import Feedback from "./Feedback/Feedback";
import Layout from "./Layout/Layout";
import { UsageProvider } from "./contexts/UsageContext";
import AdminPanel from "./AdminPanel/AdminPanel";



//protected route component
//cant access certain page as a logged in user, others cant
interface ProtectedRouteProps {
  children: React.ReactElement;
}

//sets up routes and protects pages that needs login
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <UsageProvider>
      <Router>
        <div>
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/" element={<Homepage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes - requires authentication */}
            <Route
              path="/newchat/:chatId?"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewChat />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mychats"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyChats />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Billing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Feedback />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminPanel />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UsageProvider>
  );
}

export default App;
