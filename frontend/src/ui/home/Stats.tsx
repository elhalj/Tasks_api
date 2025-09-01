

const Stats = () => {
  return (
    <div>
      <section className="py-16 bg-white">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</div>
                    <div className="text-gray-600">Utilisateurs Actifs</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500K+</div>
                    <div className="text-gray-600">Tâches Créées</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">99%</div>
                    <div className="text-gray-600">Satisfaction Client</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </section>
    </div>
  )
}

export default Stats
