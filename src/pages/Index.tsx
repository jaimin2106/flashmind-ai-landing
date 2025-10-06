import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <BentoGrid />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
