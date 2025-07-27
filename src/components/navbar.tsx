// src/components/Navbar.tsx
import { getCurrentUserIdFromToken } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  Home,
  LogOut,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserIdFromToken();

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

                <DropdownMenuItem asChild>
                  <Link to="/groups/recommended-groups" className="w-full">
                    Recommended Groups
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/messages"
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            <Link
              to="/contests"
              className="flex items-center space-x-1 text-slate-700 hover:text-blue-600"
            >
              <Bell className="w-7 h-7" />
              <span>Contests</span>
            </Link>
          </div>

          {/* Profile Menu and Logout */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            {currentUserId && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 outline-none">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block">Me</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={`/user/${currentUserId}`} className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Fallback Logout Button if no user ID */}
            {!currentUserId && (
              <button
                onClick={handleLogout}
                className="flex items-center text-slate-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-1 text-sm">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
