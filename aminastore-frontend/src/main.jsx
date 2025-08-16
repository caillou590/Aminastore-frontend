import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import { useLocation } from "react-router-dom";

// Selector pour distinguer admin/public
function RoutesSelector() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return isAdminRoute ? <AdminApp /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoutesSelector />
    </BrowserRouter>
  </React.StrictMode>
);
