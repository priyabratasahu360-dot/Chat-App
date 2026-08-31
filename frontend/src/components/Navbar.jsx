import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
export const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#c0c0c0] border-b-2 border-black">
      {" "}
      <div className="h-14 px-2">
        {" "}
        <div className="flex items-center justify-between h-full">
          {" "}
          {/* Logo */}{" "}
          <Link to="/" className="flex items-center gap-2 px-2 py-1">
            {" "}
            <div className="w-8 h-8 bg-[#c0c0c0] flex items-center justify-center border-2 border-white border-r-black border-b-black">
              {" "}
              <MessageSquare className="size-5 text-[#000080]" />{" "}
            </div>{" "}
            <h1 className="text-base font-bold text-black"> Chat App </h1>{" "}
          </Link>{" "}
          {/* Right Side */}{" "}
          <div className="flex items-center gap-1">
            {" "}
            {/* Settings */}{" "}
            <Link
              to="/settings"
              className="flex items-center gap-2 bg-[#c0c0c0] text-black px-3 py-1.5 text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
            >
              {" "}
              <Settings className="size-4" />{" "}
              <span className="hidden sm:inline">Settings</span>{" "}
            </Link>{" "}
            {/* Profile + Logout */}{" "}
            {authUser && (
              <>
                {" "}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-[#c0c0c0] text-black px-3 py-1.5 text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
                >
                  {" "}
                  <User className="size-4" />{" "}
                  <span className="hidden sm:inline"> Profile </span>{" "}
                </Link>{" "}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-[#c0c0c0] text-black px-3 py-1.5 text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
                >
                  {" "}
                  <LogOut className="size-4" />{" "}
                  <span className="hidden sm:inline"> Logout </span>{" "}
                </button>{" "}
              </>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
};
