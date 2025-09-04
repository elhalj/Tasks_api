import { Calendar, Filter, Grid3X3, List, Plus } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Barre d'outils en haut de la page des tâches
 * @param viewMode mode d'affichage actuel (grid ou list)
 * @param setViewMode fonction pour changer le mode d'affichage
 */
const UtilsBar = ({
  viewMode,
  setViewMode,
}: {
  viewMode: string;
  setViewMode: (grid: string) => void;
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-6">
      {/* Titre et boutons d'ajout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-shadow-slate-700">
          Mes Tâches
        </h2>

        <div className="flex flex-col sm:flex-row sm:space-x-2 gap-2 mt-2 sm:mt-0">
          {/* Ajouter une tâche */}
          <Link
            to="/dashboard/add/task"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une tâche</span>
          </Link>

          {/* Ajouter une room */}
          <Link
            to="/dashboard/add/room"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une room</span>
          </Link>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
        {/* Filtrer */}
        <button
          type="button"
          className="p-2 text-gray-300 hover:text-shadow-slate-700 rounded-lg hover:bg--slatetext-shadow-slate-700/10 transition-all"
          onClick={() => alert("Pas encore fonctionnel")}
          title="Filtrer les tâches"
        >
          <Filter className="w-5 h-5" />
        </button>

        {/* Vue calendrier */}
        <button
          type="button"
          className="p-2 text-gray-300 hover:text-shadow-slate-700 rounded-lg hover:bg--slatetext-shadow-slate-700/10 transition-all"
          title="Vue calendrier"
          onClick={() => alert("Pas encore fonctionnel")}
        >
          <Calendar className="w-5 h-5" />
        </button>

        {/* Changer le mode d'affichage */}
        <div className="flex bg-slate-700/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid" ? "bg-slate-700/20 text-shadow-slate-700" : "text-gray-300"
            } transition-all`}
            title="Vue grille"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list" ? "bg--slatetext-shadow-slate-700/20 text-shadow-slate-700" : "text-gray-300"
            } transition-all`}
            title="Vue liste"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilsBar;
