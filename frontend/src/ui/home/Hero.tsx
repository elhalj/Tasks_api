import {
  ArrowRight,
  CheckCircle,
  GitBranch,
  Rocket,
  ZapIcon,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { roadmapItems } from "../../seeds/roadmapItems";

const Hero = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div
            className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 animate-fade-in">
              <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-600/30">
                🚀 Nouveau : MVP Finalisé avec PR #25
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Gérez vos tâches
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                en équipe
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Une API RESTful moderne et sécurisée pour la collaboration en
              temps réel. Construite avec les dernières technologies web pour
              une performance exceptionnelle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <Rocket className="w-5 h-5" />
                <span>Commencer maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://github.com/elhalj/Tasks_api"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-700/50 transition-all flex items-center space-x-2"
              >
                <FaGithub className="w-5 h-5" />
                <span>Code source</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Dernières <span className="text-green-400">Améliorations</span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-600">
              <div className="flex items-center mb-6">
                <GitBranch className="w-8 h-8 text-green-400 mr-4" />
                <h3 className="text-2xl font-bold">PR #25 - MVP Finalisé</h3>
                <span className="ml-auto bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  Merged
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-blue-400 flex items-center">
                    <Rocket className="w-5 h-5 mr-2" />
                    Nouvelles Fonctionnalités
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Système de rooms collaboratives</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Gestion avancée des membres</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Notifications toast en temps réel</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4 text-purple-400 flex items-center">
                    <ZapIcon className="w-5 h-5 mr-2" />
                    Améliorations
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Optimisation population données API</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Interface utilisateur modernisée</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Gestion statuts et priorités</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Roadmap <span className="text-yellow-400">2025</span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {roadmapItems.map((item, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
