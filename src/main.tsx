import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AuthProvider from "./Provider/AuthProvider.tsx";
import { RouterProvider } from "react-router-dom";
import Routes from "./routes/routes.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import RootLayout from "./pages/Layout/Layout.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    <ToastContainer />
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RootLayout>
          <AuthProvider>
            <RouterProvider router={Routes}></RouterProvider>
          </AuthProvider>
        </RootLayout>
      </QueryClientProvider>
    </React.StrictMode>
  </div>
);
