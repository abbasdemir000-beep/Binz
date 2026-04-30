import { createBrowserRouter, Outlet } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import StationDetail from "./pages/StationDetail";
import AddStation from "./pages/AddStation";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";
import { Navbar } from "./components/Navbar";
import { Toaster } from "sonner";
import { LanguageProvider } from "./context/LanguageContext";

function Root() {
  return (
    <LanguageProvider>
      <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
        <div className="w-full max-w-[430px] bg-white relative min-h-screen shadow-2xl">
          <Outlet />
          <Navbar />
          <Toaster position="top-center" richColors />
        </div>
      </div>
    </LanguageProvider>
  );
}

function AuthRoot() {
  return (
    <LanguageProvider>
      <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
        <div className="w-full max-w-[430px] bg-white relative min-h-screen shadow-2xl">
          <Outlet />
          <Toaster position="top-center" richColors />
        </div>
      </div>
    </LanguageProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthRoot />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    element: <Root />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/station/:id",
        element: <StationDetail />,
      },
      {
        path: "/add",
        element: <AddStation />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
    ],
  },
]);
