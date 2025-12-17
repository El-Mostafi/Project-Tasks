import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { LogOut, FolderKanban } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2">
            <FolderKanban className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="text-base sm:text-xl font-bold text-gray-800">
              <span className="hidden sm:inline">Project Tasks Manager</span>
              <span className="sm:hidden">Tasks Manager</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
