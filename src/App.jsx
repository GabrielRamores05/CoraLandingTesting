import { useState } from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Challenges from "./components/challenges";
import Purpose from "./components/purpose";
import Partners from "./components/Partners";
import ServingCooperatives from "./components/servingCooperatives";
import Services from "./components/Services";
import CooperativeChoice from "./components/cooperativeChoice";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import DataPrivacy from "./components/DataPrivacy";
import TransparencyVideo from "./components/TransparencyVideo";
import ComparisonTable from "./components/ComparisonTable";
import Onboarding from "./components/Onboarding";
import LiveDemoButton from "./components/LiveDemoButton";

function App() {
  const [page, setPage] = useState("home");

  if (page === "privacy") {
    return <DataPrivacy onBack={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "instant" }); }} />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <TransparencyVideo />
      <Partners />
      <ServingCooperatives />
      <Challenges />
      <Purpose />
      <ComparisonTable />
      <Onboarding />
      <Services />
      <CooperativeChoice />
      <FAQ />
      <Footer onPrivacyClick={() => setPage("privacy")} />
      <LiveDemoButton />
    </>
  );
}

export default App;
