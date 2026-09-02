import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Books from "../pages/catalog/Books/Books";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main application */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Temporary routes */}
          <Route
           path="/books"
           element={<Books />}
           / >
                    
          <Route
            path="/authors"
            element={<h2>Authors</h2>}
          />

          <Route
            path="/publishers"
            element={<h2>Publishers</h2>}
          />

          <Route
            path="/subjects"
            element={<h2>Subjects</h2>}
          />

          <Route
            path="/items"
            element={<h2>Items</h2>}
          />

          <Route
            path="/patrons"
            element={<h2>Patrons</h2>}
          />

          <Route
            path="/circulation"
            element={<h2>Circulation</h2>}
          />

          <Route
            path="/holds"
            element={<h2>Holds</h2>}
          />

          <Route
            path="/reports"
            element={<h2>Reports</h2>}
          />

          <Route
            path="/notifications"
            element={<h2>Notifications</h2>}
          />

          <Route
            path="/users"
            element={<h2>Users</h2>}
          />

          <Route
            path="/audit"
            element={<h2>Audit Logs</h2>}
          />

          <Route
            path="/system"
            element={<h2>System</h2>}
          />
        </Route>

        {/* Default */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;