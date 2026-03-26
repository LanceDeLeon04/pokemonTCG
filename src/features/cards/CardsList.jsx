import React, { useEffect, useState } from "react";
import { useGetCardsQuery } from "../../services/pokemonApi";
import CardItem from "../../components/CardItem";
import CardModal from "../../components/CardModal";
import { useNavigate } from "react-router-dom";
import mainBg from "../../bg-resources/main-bg.png"; // ✅ Full import

const CardsList = () => {
  const [positions, setPositions] = useState([]);
  const [flip, setFlip] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState([]);
  const [shufflePhase, setShufflePhase] = useState(false);

  const navigate = useNavigate();

  const { data, isLoading, error } = useGetCardsQuery(
    { name: search, page: 1 },
    { refetchOnMountOrArgChange: true }
  );

  const calculateGridPositions = (order) => {
    if (!data?.data) return [];
    const cardWidth = 150;
    const gap = 20;
    const cardsPerRow = Math.floor(window.innerWidth / (cardWidth + gap)) || 1;

    return order.map((cardIndex, i) => ({
      x: (i % cardsPerRow) * (cardWidth + gap),
      y: Math.floor(i / cardsPerRow) * 220,
      cardIndex,
    }));
  };

  useEffect(() => {
    if (!data?.data) return;

    const initialOrder = data.data.map((_, i) => i);
    setShuffledOrder(initialOrder);

    const initialPos = calculateGridPositions(initialOrder);
    setPositions(initialPos);

    const handleResize = () => setPositions(calculateGridPositions(shuffledOrder));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]);

  const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const triggerShuffle = () => {
    if (!data?.data) return;

    setFlip(true);
    setShufflePhase(true);

    const centerX = window.innerWidth / 2 - 75;
    const centerY = 200;

    setPositions(data.data.map(() => ({ x: centerX, y: centerY, cardIndex: -1 })));

    setTimeout(() => {
      const newOrder = shuffleArray(shuffledOrder);
      setShuffledOrder(newOrder);

      const newPositions = calculateGridPositions(newOrder);
      setPositions(newPositions);

      setShufflePhase(false);
    }, 800);

    setTimeout(() => setFlip(false), 1800);
  };

  const handleCardClick = (card) => {
    if (shufflePhase) return;
    setSelectedCard(card);
    setModalOpen(true);
  };

  const containerWidth = positions.length
    ? Math.max(...positions.map((p) => p.x)) + 150
    : "100%";

  const startMatch = () => {
    if (!data?.data || data.data.length < 2) {
      alert("You need at least 2 cards to match!");
      return;
    }
    sessionStorage.setItem("matchCards", JSON.stringify(data.data));
    navigate("/match");
  };

  return (
    <div
      className="relative w-screen h-screen overflow-auto"
      style={{
        backgroundImage: `url(${mainBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent overlay for 65% transparency */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(255,255,255,0.35)", zIndex: 0 }}
      />

      {/* Content goes on top of overlay */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4">
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
            onClick={triggerShuffle}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300"
          >
            Shuffle
          </button>
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

        {/* Cards */}
        <div
          className="relative h-[calc(100vh-180px)] z-10"
          style={{ width: containerWidth }}
        >
          {data?.data?.map((card, idx) => {
            const posObj = positions.find((p) => p.cardIndex === idx) || { x: 0, y: 0 };
            return (
              <CardItem
                key={card.id}
                card={card}
                flip={flip}
                pos={posObj}
                onClick={handleCardClick}
              />
            );
          })}
        </div>

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