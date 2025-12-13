import { CheckCircle, Menu, X } from "lucide-react"
// import { useContext } from "react"
// import { Link } from "react-router-dom"
// import { AuthContext } from "../../context"
import { FaGithub } from "react-icons/fa"


const Header = ({ isMenuOpen, setIsMenuOpen, scrollY }: { isMenuOpen: boolean, setIsMenuOpen: (isOpen: boolean) => void, scrollY: number }) => {
    // const {currentUser} = useContext(AuthContext)
  return (
    <div>
       {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700" style={{ boxShadow: scrollY > 0 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Tasks API</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-blue-400 transition-colors">Fonctionnalités</a>
              <a href="#tech" className="hover:text-blue-400 transition-colors">Technologies</a>
              <a href="#roadmap" className="hover:text-blue-400 transition-colors">Roadmap</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/elhalj/Tasks_api" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition-all flex items-center space-x-2 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <FaGithub className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#features" className="block hover:text-blue-400 transition-colors">Fonctionnalités</a>
              <a href="#tech" className="block hover:text-blue-400 transition-colors">Technologies</a>
              <a href="#roadmap" className="block hover:text-blue-400 transition-colors">Roadmap</a>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Header
