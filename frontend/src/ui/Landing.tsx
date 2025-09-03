import { useState } from "react";
import Header from "./home/Header";
import Hero from "./home/Hero";
import Stats from "./home/Stats";
import Pricing from "./home/Pricing";
import Cta from "./home/Cta";
import Footer from "./home/Footer";
import Testimonial from "./home/Testimonial";
import Feature from "./home/Feature";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Features Section */}
      <Feature />

      {/* Pricing Section */}
      <Pricing />

      {/* Testimonials Section */}
      <Testimonial />

      {/* CTA Section */}
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;


// Amelioration future
// import { useContext, useState } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { CheckCircle2, Users, ArrowRight, Menu, X } from "lucide-react";
// import { AuthContext } from "../context";

// const LandingPage = () => {
//   const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const {currentUser, logout} = useContext(AuthContext)

//   const toggleFAQ = (index: number | null) => {
//     setActiveFAQ(activeFAQ === index ? null : index);
//   };

//   return (
//     <div className="font-sans text-white bg-gradient-to-br from-purple-800 via-pink-700 to-purple-900">
//       {/* Header */}
//       <header className="backdrop-blur-sm bg-white/10 border-b border-white/20 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//             <CheckCircle2 className="w-6 h-6 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold">
//             <NavLink to="/">TaskFlow</NavLink>
//           </h1>
//         </div>

//         {/* Desktop nav */}
//         <nav className="hidden md:flex gap-8 items-center">
//           <NavLink to="/" className="hover:text-pink-400 transition">Accueil</NavLink>
//           <NavLink to="/features" className="hover:text-pink-400 transition">Fonctionnalités</NavLink>
//           <NavLink to="/how" className="hover:text-pink-400 transition">Comment ça marche</NavLink>
//           <NavLink to="/pricing" className="hover:text-pink-400 transition">Tarifs</NavLink>
//           <NavLink to="/faq" className="hover:text-pink-400 transition">FAQ</NavLink>
//           {currentUser ? (
//             <>
//               <button onClick={logout} className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-full transition">Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition">Connexion</Link>
//               <Link to="/signup" className="px-4 py-2 border border-white/30 rounded-full hover:bg-white/10 transition">Inscription</Link>
//             </>
//           )}
//         </nav>

//         {/* Mobile burger */}
//         <button
//           type="button"
//           className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
//           onClick={() => setShowMenu(!showMenu)}
//         >
//           {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Mobile menu */}
//       {showMenu && (
//         <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
//           <div className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white/10 backdrop-blur-lg p-6 flex flex-col gap-6 text-white shadow-lg">
//             <nav className="flex flex-col gap-4">
//               <NavLink to="/" onClick={() => setShowMenu(false)}>Accueil</NavLink>
//               <NavLink to="/features" onClick={() => setShowMenu(false)}>Fonctionnalités</NavLink>
//               <NavLink to="/how" onClick={() => setShowMenu(false)}>Comment ça marche</NavLink>
//               <NavLink to="/pricing" onClick={() => setShowMenu(false)}>Tarifs</NavLink>
//               <NavLink to="/faq" onClick={() => setShowMenu(false)}>FAQ</NavLink>
//             </nav>
//             <div className="mt-auto flex flex-col gap-3">
//               {currentUser ? (
//                 <button onClick={logout} className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-full transition">
//                   Logout
//                 </button>
//               ) : (
//                 <>
//                   <Link to="/login" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition" onClick={() => setShowMenu(false)}>Connexion</Link>
//                   <Link to="/signup" className="px-4 py-2 border border-white/30 rounded-full hover:bg-white/10 transition" onClick={() => setShowMenu(false)}>Inscription</Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>

//       {/* Hero */}
//       <section id="hero" className="text-center px-6 py-32 relative z-10">
//         <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
//           Gérez vos tâches <span className="text-pink-400">efficacement</span>
//         </h1>
//         <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-white/90">
//           TaskFlow vous aide à organiser vos projets, collaborer avec votre équipe et suivre la progression de chaque tâche.
//         </p>
//         <div className="flex flex-col sm:flex-row justify-center gap-4">
//           <Link to="/signup" className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-full hover:bg-white/90 transition">
//             Commencer maintenant
//           </Link>
//           <a href="#features" className="px-6 py-3 border border-white/40 rounded-full hover:bg-white/10 transition">
//             Découvrir les fonctionnalités
//           </a>
//         </div>
//       </section>

//       {/* Fonctionnalités */}
//       <section id="features" className="py-20 px-6">
//         <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Fonctionnalités principales</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
//             <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-pink-400"/>
//             <h3 className="text-xl font-semibold mb-2">Gestion des tâches</h3>
//             <p>Créez, modifiez et organisez vos tâches rapidement avec une interface simple.</p>
//           </div>
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
//             <Users className="w-10 h-10 mx-auto mb-4 text-pink-400"/>
//             <h3 className="text-xl font-semibold mb-2">Collaboration en équipe</h3>
//             <p>Assignez des tâches et travaillez en équipe sur tous vos projets.</p>
//           </div>
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
//             <ArrowRight className="w-10 h-10 mx-auto mb-4 text-pink-400"/>
//             <h3 className="text-xl font-semibold mb-2">Suivi de progression</h3>
//             <p>Visualisez l’état d’avancement de vos projets et tâches en temps réel.</p>
//           </div>
//         </div>
//       </section>

//       {/* Comment ça marche */}
//       <section id="how" className="py-20 px-6 bg-white/10 backdrop-blur-lg">
//         <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Comment ça marche</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
//           <div className="p-6 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300">
//             <h3 className="text-xl font-semibold mb-2">1. Créez un compte</h3>
//             <p>Inscrivez-vous et configurez votre espace de travail en quelques clics.</p>
//           </div>
//           <div className="p-6 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300">
//             <h3 className="text-xl font-semibold mb-2">2. Ajoutez vos tâches</h3>
//             <p>Organisez vos tâches par projet et assignez-les à vos collaborateurs.</p>
//           </div>
//           <div className="p-6 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300">
//             <h3 className="text-xl font-semibold mb-2">3. Suivez et collaborez</h3>
//             <p>Suivez la progression, commentez et gérez vos projets en équipe.</p>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section id="testimonials" className="py-20 px-6">
//         <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Ce que disent nos utilisateurs</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl hover:scale-105 transition-all duration-300">
//             <p className="mb-4">“TaskFlow a transformé notre organisation, nous gérons désormais nos projets facilement.”</p>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">A</div>
//               <span>Alex, Product Manager</span>
//             </div>
//           </div>
//           <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl hover:scale-105 transition-all duration-300">
//             <p className="mb-4">“Collaboration et suivi en temps réel, TaskFlow est indispensable pour notre équipe.”</p>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">M</div>
//               <span>Marie, Développeuse</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Pricing */}
//       <section id="pricing" className="py-20 px-6 bg-white/10 backdrop-blur-lg">
//         <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Tarifs</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
//           <div className="p-6 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300">
//             <h3 className="text-xl font-semibold mb-2">Gratuit</h3>
//             <p className="mb-4">Essentiel pour commencer</p>
//             <p className="text-2xl font-bold mb-4">0€</p>
//             <ul className="mb-4 space-y-2 text-sm">
//               <li>✅ 5 Projets</li>
//               <li>✅ Collaboration limitée</li>
//             </ul>
//             <Link to="/signup" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition">Commencer</Link>
//           </div>
//           <div className="p-6 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300">
//             <h3 className="text-xl font-semibold mb-2">Pro</h3>
//             <p className="mb-4">Pour les équipes</p>
//             <p className="text-2xl font-bold mb-4">10€/mois</p>
//             <ul className="mb-4 space-y-2 text-sm">
//               <li>✅ Projets illimités</li>
//               <li>✅ Collaboration complète</li>
//               <li>✅ Statistiques avancées</li>
//             </ul>
//             <Link to="/signup" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition">S'inscrire</Link>
//           </div>
//         </div>
//       </section>

//       {/* FAQ */}
//       <section id="faq" className="py-20 px-6">
//         <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">FAQ</h2>
//         <div className="max-w-4xl mx-auto space-y-4">
//           {[
//             { q: "Comment créer un compte ?", a: "Cliquez sur le bouton S'inscrire et remplissez le formulaire." },
//             { q: "Puis-je collaborer avec mon équipe ?", a: "Oui, vous pouvez inviter vos membres et assigner des tâches." },
//             { q: "Y a-t-il un plan gratuit ?", a: "Oui, le plan gratuit permet de tester l'essentiel." }
//           ].map((item, index) => (
//             <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 cursor-pointer"
//               onClick={() => toggleFAQ(index)}>
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold">{item.q}</h3>
//                 <span>{activeFAQ === index ? "-" : "+"}</span>
//               </div>
//               {activeFAQ === index && <p className="mt-2 text-sm text-white/80">{item.a}</p>}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20 py-8 text-center">
//         <p>&copy; 2025 TaskFlow. Tous droits réservés.</p>
//         <div className="mt-4 flex justify-center gap-6">
//           <a href="#" className="hover:text-pink-400 transition">Twitter</a>
//           <a href="#" className="hover:text-pink-400 transition">Github</a>
//           <a href="#" className="hover:text-pink-400 transition">LinkedIn</a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
