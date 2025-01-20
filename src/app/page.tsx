import Header from '@/components/header';
import Hero from '@/components/hero';
import Features from '@/components/features';
import Pricing from '@/components/pricing';
import Faq from '@/components/faq';
import Testimnials from '@/components/testimonials';
import Download from '@/components/download';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <Testimnials />
      <Download />
      <Footer />
    </div>
  );
}
