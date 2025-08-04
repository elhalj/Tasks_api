import { ArrowRight, CheckCircle2, Play } from "lucide-react"
import { Link } from "react-router-dom"


const Hero = () => {
  return (
    <div>
      <section id="accueil" className="py-16 bg-gray-50">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                      Gérez Vos Tâches 
                      <span className="text-blue-600"> Efficacement</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      TaskFlow est la solution complète pour organiser votre travail, 
                      collaborer avec votre équipe et atteindre vos objectifs plus rapidement.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <button className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                        <span><Link to="/login">Commencer Gratuitement</Link></span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>Voir la Démo</span>
                      </button>
                    </div>
      
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      <Link to="/login">Essai gratuit 14 jours • Aucune carte bancaire requise</Link>
                    </div>
                  </div>
      
                  <div className="relative">
                    <div className="bg-white rounded-lg shadow-lg p-6 border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Tableau de Bord</h3>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Finaliser le rapport</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">En cours</span>
                          </div>
                        </div>
                        <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Réunion équipe</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Terminé</span>
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Révision code</span>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">À faire</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    </div>
  )
}

export default Hero
