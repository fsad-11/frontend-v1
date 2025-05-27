import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewRequest from "./pages/NewRequest";
import AdminPanel from "./pages/AdminPanel";
import RequestDetails from "./pages/RequestDetails";
import Manager from "./pages/Manager";
import ManagerReview from "./pages/ManagerReview";
import { UserProvider } from "./context/UserContext";
import FinanceManager from "./pages/FinanceManager";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./pages/NotFound";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Protected routes with role-based access */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={<Dashboard />}
                allowedRoles={["employee", "manager", "finance", "admin"]}
              />
            }
          />

          <Route
            path="/new-request"
            element={
              <PrivateRoute
                element={<NewRequest />}
                allowedRoles={["employee", "manager"]}
              />
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute element={<AdminPanel />} allowedRoles={["admin"]} />
            }
          />

          <Route
            path="/manager"
            element={
              <PrivateRoute element={<Manager />} allowedRoles={["manager"]} />
            }
          />

          <Route
            path="/finance"
            element={
              <PrivateRoute
                element={<FinanceManager />}
                allowedRoles={["finance"]}
              />
            }
          />

          <Route
            path="/request/:id"
            element={
              <PrivateRoute
                element={<RequestDetails />}
                allowedRoles={["employee", "manager", "finance"]}
              />
            }
          />

          <Route
            path="/manager/review/:id"
            element={
              <PrivateRoute
                element={<ManagerReview />}
                allowedRoles={["manager"]}
              />
            }
          />

          {/* 404 page - this will catch all undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
