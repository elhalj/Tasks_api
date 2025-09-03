import { Bell, CheckCircle2, Menu, Search, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context";
import { NavLink } from "react-router-dom";

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                <NavLink to="/">TaskFlow</NavLink>
              </h1>
            </div>

            {/* Menu burger sur mobile */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setShowMenu(true)}
                className="p-2 text-slate-300 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" /> {}
              </button>
            </div>

            {/* Barre de recherche et actions sur desktop */}
            <div className="hidden sm:flex-1 sm:max-w-lg sm:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Actions desktop */}
            <div className="hidden sm:flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-300 hover:text-white transition-colors"
              >
                <Bell className="w-6 h-6" /> {}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>

              <div className="w-24 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex flex-col items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-sm">
                  {currentUser?.userName}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Menu burger mobile */}
        {showMenu && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setShowMenu(false)}
          ></div>
        )}
        {showMenu && (
          <div className="fixed inset-0 z-50 flex justify-center">
            <div className="w-full max-w-md mx-4 mt-16 bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 shadow-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  <NavLink to="/">TaskFlow</NavLink>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowMenu(false)}
                  className="p-2 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" /> {}
                </button>
              </div>

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Bell className="w-6 h-6" /> {}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                </button>

                <div className="w-24 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex flex-col items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">
                    {currentUser?.userName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
