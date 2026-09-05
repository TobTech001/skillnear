import Layout from "../components/Layout";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import ServiceCategories from "../components/ServiceCategories";
import ProviderPreview from "../components/ProviderPreview";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/Faq";
import ProviderCTA from "../components/ProviderCTA";

export default function Home() {
  return (
    <Layout>
      <div id="top">
        <Hero />
        <HowItWorks />
        <ServiceCategories />
        <ProviderPreview />
        <Testimonials />
        <FAQ />
        <ProviderCTA />
      </div>
    </Layout>
  );
}