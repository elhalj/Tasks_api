

const Cta = () => {
  return (
    <div>
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à Améliorer Votre Productivité ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà adopté TaskFlow pour gérer leurs tâches
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded hover:bg-gray-50 transition-colors font-semibold">
              Essai Gratuit 14 Jours
            </button>
            <button className="border border-white text-white px-8 py-3 rounded hover:bg-blue-700 transition-colors">
              Planifier une Démo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Cta
