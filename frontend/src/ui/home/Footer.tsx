import { CheckCircle } from "lucide-react"
import {  FaGithub } from "react-icons/fa"


const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 py-12 border-t border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <span className="text-white text-lg font-semibold">Tasks API</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="https://github.com/elhalj/Tasks_api" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="w-6 h-6" />
              </a>
              <span className="text-gray-400">
                Fait avec ❤️ et Fastify par 
                <a href="https://github.com/elhalj" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                  @elhalj
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
