import React from "react";
import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/hotelOwner/Sidebar";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useUser } from "@clerk/clerk-react";

const Layout = () => {
  const { isOwner } = useAppContext();
  const { isLoaded, isSignedIn } = useUser();

  // Wait for Clerk to load before deciding
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  // Not logged in → go to home
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Logged in but not a hotel owner → show access denied
  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">
        <div className="text-5xl">🏨</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Hotel Owner Access Only
        </h1>
        <p className="text-gray-500 max-w-sm">
          You need to register your hotel before accessing the dashboard.
        </p>
        <Link
          to="/"
          className="mt-2 px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-dull transition-colors"
        >
          Go to Home & Register Hotel
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 p-4 pt-10 md:px-10 h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
