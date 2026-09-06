import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProofBar } from "@/components/ProofBar";
import { HowItWorks } from "@/components/HowItWorks";
import { CurriculumGrid } from "@/components/CurriculumGrid";
import { AudioDemo } from "@/components/AudioDemo";
import { Personas } from "@/components/Personas";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { CtaSection, Footer } from "@/components/CtaFooter";

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofBar />
        <HowItWorks />
        <CurriculumGrid />
        <AudioDemo />
        <Personas />
        <Pricing />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
