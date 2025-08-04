import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react"
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"


const Footer = () => {
  return (
    <div>
      <footer id="contact" className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">TaskFlow</h3>
              </div>
              <p className="text-gray-400 mb-4">
                La solution complète pour gérer vos tâches et projets efficacement.
              </p>
              <div className="flex space-x-4">
                <FaFacebook className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                <FaTwitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                <FaLinkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                <FaInstagram className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>contact@taskflow.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+225 07 69 98 82 11</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Abidjan, Cote-d'Ivoire</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                      <p className="text-gray-400 text-sm">
              © {(new Date().getFullYear())} TaskFlow. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
