import { Bell, CheckCircle2, Menu, Search, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  {
    /* Drawer mobile */
  }
  if (showMenu) {
    return (
      <div className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-slate-500/50 text-white backdrop-blur-lg border-l border-slate-700/50 z-50 p-6 flex flex-col duration-75">
        {/* Header du drawer */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            <NavLink to="/">TaskFlow</NavLink>
          </h2>
          <button
            type="button"
            onClick={() => setShowMenu(false)}
            className="p-2 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
            {}
          </button>
        </div>

        {/* Recherche mobile */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Actions mobile */}
        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center space-x-3 text-white hover:text-white transition-colors"
          >
            <Bell className="w-6 h-6" />
            <span>Notifications</span>
          </button>

          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 shadow-md">
            <User className="w-5 h-5 text-white" />
            <span className="text-white font-bold">
              {currentUser?.userName}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm  sticky top-0 z-50 duration-150">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900/50 rounded-lg flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                <NavLink to="/">TaskFlow</NavLink>
              </h1>
            </div>

            {/* Bouton burger mobile */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setShowMenu(true)}
                className="p-2 text-slate-300 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
                {}
              </button>
            </div>

            {/* Barre de recherche + actions (desktop uniquement) */}
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
                <Bell className="w-6 h-6" />
                {}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
              </button>

              <div className="w-24 h-12 bg-slate-700/50 rounded-full flex flex-col items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-sm">
                  <Link to={`/dashboard/profile/${currentUser?._id || ''}`}>{currentUser?.userName || 'User'}</Link>
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="bg-slate-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
