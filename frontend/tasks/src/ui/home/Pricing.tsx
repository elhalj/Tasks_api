import { CheckCircle2 } from "lucide-react"


const Pricing = () => {
  return (
    <div>
      <section id="tarifs" className="py-16 bg-white">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Tarifs Simples et Transparents
                  </h2>
                  <p className="text-xl text-gray-600">
                    Choisissez le plan qui convient à votre équipe
                  </p>
                </div>
      
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Plan Gratuit */}
                  <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Gratuit</h3>
                      <div className="text-3xl font-bold text-gray-800">0€</div>
                      <div className="text-gray-500">par mois</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">Jusqu'à 10 tâches</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">1 utilisateur</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">Support email</span>
                      </li>
                    </ul>
                    <button type="button" className="w-full border border-blue-600 text-blue-600 py-3 rounded hover:bg-blue-50 transition-colors">
                      Commencer
                    </button>
                  </div>
      
                  {/* Plan Pro */}
                  <div className="bg-blue-600 p-8 rounded-lg shadow-lg text-white relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-yellow-400 text-gray-800 px-4 py-1 rounded-full text-sm font-medium">
                        Populaire
                      </div>
                    </div>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold mb-2">Pro</h3>
                      <div className="text-3xl font-bold">19€</div>
                      <div className="text-blue-100">par mois</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-blue-100 mr-3" />
                        <span>Tâches illimitées</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-blue-100 mr-3" />
                        <span>Jusqu'à 10 utilisateurs</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-blue-100 mr-3" />
                        <span>Collaboration équipe</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-blue-100 mr-3" />
                        <span>Support prioritaire</span>
                      </li>
                    </ul>
                    <button type="button" className="w-full bg-white text-blue-600 py-3 rounded hover:bg-gray-50 transition-colors font-semibold">
                      Essai Gratuit
                    </button>
                  </div>
      
                  {/* Plan Entreprise */}
                  <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Entreprise</h3>
                      <div className="text-3xl font-bold text-gray-800">49€</div>
                      <div className="text-gray-500">par mois</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">Utilisateurs illimités</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">Intégrations avancées</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">Analytics détaillées</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">Support 24/7</span>
                      </li>
                    </ul>
                    <button type="button" className="w-full border border-blue-600 text-blue-600 py-3 rounded hover:bg-blue-50 transition-colors">
                      Nous Contacter
                    </button>
                  </div>
                </div>
              </div>
            </section>
    </div>
  )
}

export default Pricing
