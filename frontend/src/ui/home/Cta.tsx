import { GitBranch, Star } from "lucide-react"


const Cta = () => {
  return (
    <>
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à Collaborer ?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Rejoignez la communauté open source et contribuez au développement de la prochaine génération d'outils de collaboration
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://github.com/elhalj/Tasks_api" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>Star sur GitHub</span>
            </a>
            
            <a 
              href="https://github.com/elhalj/Tasks_api/fork" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-900/40 transition-all flex items-center space-x-2"
            >
              <GitBranch className="w-5 h-5" />
              <span>Fork le Projet</span>
            </a>
          </div>
          
          <div className="mt-12 flex justify-center space-x-8 text-blue-100">
            <div className="text-center">
              <div className="text-2xl font-bold">Open Source</div>
              <div className="text-sm">Licence MIT</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Moderne</div>
              <div className="text-sm">Node.js 22+</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Sécurisé</div>
              <div className="text-sm">JWT Auth</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Cta
