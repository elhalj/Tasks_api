
import { Code, Database } from 'lucide-react'
import { features } from '../../seeds/features'

const Feature = () => {
  return (
    <>
      <section id="fonctionnalites" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez pourquoi TaskFlow est l'outil de choix pour des milliers d'équipes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Installation Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Démarrage <span className="text-blue-400">Rapide</span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Installation
                  </h3>
                  <div className="bg-black rounded-lg p-4 text-sm font-mono">
                    <div className="text-green-300">
                      <div className="mb-2">git clone https://github.com/elhalj/Tasks_api</div>
                      <div className="mb-2">cd Tasks_api</div>
                      <div className="mb-2">npm install</div>
                      <div>npm run dev</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Configuration
                  </h3>
                  <div className="bg-black rounded-lg p-4 text-sm font-mono">
                    <div className="text-blue-300">
                      <div className="mb-2">PORT=3000</div>
                      <div className="mb-2">MONGODB_URI=your_mongodb_uri</div>
                      <div>JWT_SECRET=your_jwt_secret</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Feature
