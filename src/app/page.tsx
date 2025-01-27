import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Faq from "@/components/faq";
import Testimonials from "@/components/testimonials";
import Download from "@/components/download";
import Footer from "@/components/footer";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col max-w-screen mx-auto overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <Testimonials />
      <Download />
      <Footer />
    </div>
  );
}
