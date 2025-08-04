import { Menu, X } from "lucide-react"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context"


const Header = ({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean, setIsMenuOpen: (isOpen: boolean) => void }) => {
    const {user} = useContext(AuthContext)
  return (
    <div>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                <span className='text-3xl text-white font-bold'>TF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
                <p className="text-xs text-gray-500">Gestion de Tâches</p>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#accueil" className="text-gray-700 hover:text-blue-600 transition-colors">Accueil</a>
              <a href="#fonctionnalites" className="text-gray-700 hover:text-blue-600 transition-colors">Fonctionnalités</a>
              <a href="#tarifs" className="text-gray-700 hover:text-blue-600 transition-colors">Tarifs</a>
              <a href="#temoignages" className="text-gray-700 hover:text-blue-600 transition-colors">Témoignages</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                          <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Se connecter</a>
                          <div>{ user && (<div><button type="button"><Link to="dashboard">Dashboard</Link></button></div>)}</div>
            </nav>

            {/* CTA et Menu Mobile */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                <Link to="/login">Essai Gratuit</Link>
              </button>
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="flex flex-col space-y-3">
                <a href="#accueil" className="text-gray-700 hover:text-blue-600 py-2">Accueil</a>
                <a href="#fonctionnalites" className="text-gray-700 hover:text-blue-600 py-2">Fonctionnalités</a>
                <a href="#tarifs" className="text-gray-700 hover:text-blue-600 py-2">Tarifs</a>
                <a href="#temoignages" className="text-gray-700 hover:text-blue-600 py-2">Témoignages</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 py-2">Contact</a>
                <a href="/login" className="text-gray-700 hover:text-blue-600 py-2">Se connecter</a>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full">
                  <Link to="/login">Essai Gratuit</Link>
                </button>
              </div>
            </div>
                  )}
                  <div>{ user && (<div><button type="button"><Link to="dashboard">Dashboard</Link></button></div>)}</div>
        </div>
      </header>
    </div>
  )
}

export default Header
