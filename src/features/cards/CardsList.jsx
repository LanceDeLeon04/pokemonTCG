import React, { useState } from "react";
import { useGetCardsQuery } from "../../services/pokemonApi";
import CardModal from "../../components/CardModal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import mainBg from "../../bg-resources/main-bg.png";

const CardsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch cards from API
  const { data, isLoading, error } = useGetCardsQuery(
    { name: search, page: 1 },
    { refetchOnMountOrArgChange: true }
  );

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const startMatch = () => {
    if (!data?.data || data.data.length < 2) {
      alert("You need at least 2 cards to match!");
      return;
    }
    sessionStorage.setItem("matchCards", JSON.stringify(data.data));
    navigate("/match");
  };

  const cards = data?.data || [];

  return (
    <div
      className="relative w-screen min-h-screen overflow-auto p-4"
      style={{
        backgroundImage: `url(${mainBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(255,255,255,0.35)", zIndex: 0 }}
      />

      <div className="relative z-10 flex flex-col items-center min-h-screen w-full">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6 justify-center w-full">
          <input
            type="text"
            placeholder="Search Pokémon..."
            className="border px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={startMatch}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300"
          >
            Match
          </button>
        </div>

        {/* Loading & Error */}
        {isLoading && (
          <p className="text-center mt-20 text-white text-2xl font-bold relative z-10">
            Loading cards...
          </p>
        )}
        {error && (
          <p className="text-center mt-20 text-red-500 text-xl font-bold relative z-10">
            Failed to load cards.
          </p>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full z-10">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer rounded-lg overflow-hidden shadow-lg"
              onClick={() => handleCardClick(card)}
            >
              <img
                src={card.images.small}
                alt={card.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <CardModal
          card={selectedCard}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default CardsList;