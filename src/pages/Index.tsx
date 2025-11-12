import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import Impact from "@/components/Impact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <Impact />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
