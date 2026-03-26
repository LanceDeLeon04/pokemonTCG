import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CardsList from "./features/cards/CardsList";
import MatchPage from "./features/match/MatchPage";
import PokemonLogo from "./bg-resources/Pokemon_logo.png";
import LoadingPageImg from "./bg-resources/loading-page.png";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show full-screen loading for 5 seconds
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="w-screen h-screen flex flex-col justify-center items-center bg-black relative"
        style={{ overflow: "hidden" }}
      >
        <img
          src={LoadingPageImg}
          alt="Loading"
          className="absolute w-full h-full object-cover z-0"
        />
        <h1
          className="z-10 text-white font-bold text-5xl animate-pulse"
          style={{
            WebkitTextStroke: "4px darkblue",
          }}
        >
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <Router>
      <div
        className="min-h-screen w-full flex flex-col items-center"
        style={{
          backgroundImage: "url(/bg-resources/main-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Top Logo */}
        <div className="pt-4">
          <img src={PokemonLogo} alt="Pokemon TCG" className="h-24" />
        </div>

        <Routes>
          <Route path="/" element={<CardsList />} />
          <Route path="/match" element={<MatchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;