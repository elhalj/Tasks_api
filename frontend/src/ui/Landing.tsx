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
