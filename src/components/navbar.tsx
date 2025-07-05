// src/components/Navbar.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Briefcase,
  ChevronDown,
  Home,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    //localStorage.removeItem("feedCursor");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/feed" className="text-xl font-bold text-blue-600">
              Business Connect
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/feed"
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/network"
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600"
            >
              <Users className="w-5 h-5" />
              <span>My Network</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 outline-none">
                <Users className="w-5 h-5" />
                <span>Groups</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/groups/my-groups" className="w-full">
                    My Groups
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/groups/explore" className="w-full">
                    Explore Groups
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/jobs"
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600"
            >
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </Link>
            <Link
              to="/messaging"
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messaging</span>
            </Link>
            <Link
              to="/notifications"
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600"
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center text-slate-700 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-1 text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
