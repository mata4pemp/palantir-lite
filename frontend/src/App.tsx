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
import Layout from "./Layout/Layout";

//protected route component
//cant access certain page as a logged in user, others cant
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* // Protected Routes, shows homepage only when user logged in authenticated */}
          <Route
            path="/homepage"
            element={
              <ProtectedRoute>
                <Layout>
                  <Homepage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/newchat"
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
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/signup" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
