
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import useSubscriptionLimits from "../../../../app/useSubscriptionLimits";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import BenefitsSection from "./components/BenefitsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import CTASection from "./components/CTASection";

const OwnerLandingPage = () => {
  // Get plan limits from the subscription hook
  // const { limits: currentUserLimits } = useSubscriptionLimits();

  return (
    <div className="min-h-screen font-inter">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default OwnerLandingPage;
