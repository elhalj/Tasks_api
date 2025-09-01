
import { features } from '../../seeds/features'

const Feature = () => {
  return (
    <div>
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
    </div>
  )
}

export default Feature
