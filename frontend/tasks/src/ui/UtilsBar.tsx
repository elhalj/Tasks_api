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
    <div className="flex flex-col sm:flex-row justify-between items-end mb-6 sm:items-start">
      {/* Titre de la page */}
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-white">Mes Tâches</h2>
        {/* Bouton pour ajouter une nouvelle tâche */}
        <button
          type="button"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <Link to="/dashboard/add/task">Ajouter une tache</Link>
        </button>
        {/* Bouton pour ajouter une room */}
        <button
          type="button"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <Link to="/dashboard/add/room">Ajouter une une room</Link>
        </button>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center space-x-4">
        {/* Bouton pour filtrer les tâches */}
        <button
          type="button"
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          <Filter className="w-5 h-5" />
          {/* TODO: Ajouter un tooltip pour expliquer ce que fait ce bouton */}
        </button>
        {/* Bouton pour afficher le calendrier */}
        <button
          type="button"
          className="p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Calendar view"
          title="Switch to calendar view"
        >
          <Calendar className="w-5 h-5" />
        </button>
        {/* Bouton pour changer le mode d'affichage */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid" ? "bg-white/20 text-white" : "text-gray-300"
            } transition-all`}
          >
            <Grid3X3 className="w-4 h-4" />
            {/* TODO: Ajouter un tooltip pour expliquer ce que fait ce bouton */}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-white/20 text-white" : "text-gray-300"
            } transition-all`}
          >
            <List className="w-4 h-4" />
            {/* TODO: Ajouter un tooltip pour expliquer ce que fait ce bouton */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilsBar;
