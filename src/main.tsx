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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/finance" element={<FinanceManager />} />
          <Route path="/request/:id" element={<RequestDetails />} />
          <Route path="/manager/review/:id" element={<ManagerReview />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
);
