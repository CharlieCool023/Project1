import Header from "@/components/header";
import Hero from '@/components/hero';
import Features from '@/components/features';
import Pricing from '@/components/pricing';
import Faq from '@/components/faq';
import Testimnials from '@/components/testimonials';
import Download from '@/components/download';
import Footer from '@/components/footer';
import React from "react";

export default function Home() { 
  return (
    <div className="flex flex-col w-full">
        <Header />
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

