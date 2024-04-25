import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <Accounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/:accountId"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
