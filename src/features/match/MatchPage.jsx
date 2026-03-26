import React, { useState } from "react";
import { useGetCardsQuery } from "../../services/pokemonApi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import matchBg from "../../bg-resources/match-bg.png";

const MatchPage = () => {
  const navigate = useNavigate();
  const { data } = useGetCardsQuery({ page: 1 });

  const [selected, setSelected] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [reason, setReason] = useState("");
  const [battlePhase, setBattlePhase] = useState("idle"); 

  const cards = data?.data || [];

  const handleSelect = (card) => {
    if (selected.length === 2) return;
    if (selected.find((c) => c.id === card.id)) return;

    setSelected([...selected, card]);
  };

  const getStats = (card) => {
    const hp = parseInt(card.hp) || 50;

    const attack =
      card.attacks?.reduce((sum, atk) => {
        const dmg = parseInt(atk.damage) || 10;
        return sum + dmg;
      }, 0) || 10;

    return { hp, attack, total: hp + attack };
  };

  const battle = () => {
    if (selected.length < 2) return;

    setBattlePhase("fighting");

    setTimeout(() => {
      setBattlePhase("explosion");
    }, 1500);

    setTimeout(() => {
      const s1 = getStats(selected[0]);
      const s2 = getStats(selected[1]);

      if (s1.total > s2.total) {
        setWinner(selected[0]);
        setLoser(selected[1]);
        setReason(`${selected[0].name} wins (${s1.total} vs ${s2.total})`);
      } else if (s2.total > s1.total) {
        setWinner(selected[1]);
        setLoser(selected[0]);
        setReason(`${selected[1].name} wins (${s2.total} vs ${s1.total})`);
      } else {
        setWinner("draw");
        setReason("Equal power!");
      }

      setBattlePhase("result");
    }, 2300);
  };

  const reset = () => {
    setSelected([]);
    setWinner(null);
    setLoser(null);
    setReason("");
    setBattlePhase("idle");
  };

  return (
    <div
      className="relative w-screen min-h-screen overflow-hidden text-white p-6"
      style={{
        backgroundImage: `url(${matchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.1)", zIndex: 0 }}
      />

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          ⚡ Pokémon Match Arena ⚡
        </h1>

        {/* BACK */}
        <div className="text-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 rounded-full px-6 py-2 font-bold text-blue-900 hover:bg-yellow-800 transition-all"
          >
            ← Back
          </button>
        </div>

        {/* SELECTED DISPLAY */}
        <div className="flex justify-center items-center gap-10 mb-6 relative h-52">
          {selected[0] && (
            <motion.img
              src={selected[0].images.small}
              className="w-40 border-4 border-yellow-400 rounded-xl absolute"
              animate={
                battlePhase === "fighting"
                  ? { x: 120 }
                  : battlePhase === "result" && winner === selected[0]
                  ? { x: 0, scale: 1.3 }
                  : {}
              }
              style={{ left: "30%" }}
            />
          )}

          <AnimatePresence>
            {selected.length === 2 && battlePhase !== "result" && (
              <motion.div
                className="text-5xl font-bold text-red-400 absolute"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                VS
              </motion.div>
            )}
          </AnimatePresence>

          {selected[1] && (
            <motion.img
              src={selected[1].images.small}
              className="w-40 border-4 border-blue-400 rounded-xl absolute"
              animate={
                battlePhase === "fighting"
                  ? { x: -120 }
                  : battlePhase === "result" && winner === selected[1]
                  ? { x: 0, scale: 1.3 }
                  : {}
              }
              style={{ right: "30%" }}
            />
          )}

          {battlePhase === "result" && loser && (
            <motion.div
              className="absolute"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={battle}
            className="bg-yellow-500 rounded-full px-6 py-2 font-bold text-blue-900 hover:bg-yellow-800 transition-all"
          >
            Match
          </button>

          <button
            onClick={reset}
            className="bg-yellow-500 rounded-full px-6 py-2 font-bold text-blue-900 hover:bg-yellow-800 transition-all"
          >
            Reset
          </button>
        </div>

        {/* CLOUD */}
        <AnimatePresence>
          {battlePhase === "fighting" && (
            <motion.div
              className="fixed inset-0 bg-white z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>

        {/* EXPLOSION */}
        <AnimatePresence>
          {battlePhase === "explosion" && (
            <motion.div
              className="fixed inset-0 bg-yellow-400 z-50"
              initial={{ scale: 0 }}
              animate={{ scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* RESULT */}
        {battlePhase === "result" && (
          <motion.div
            className="text-center text-xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {winner === "draw" ? (
              <p>🤝 Draw! {reason}</p>
            ) : (
              <>
                <p className="text-2xl">🏆 Winner: {winner.name}</p>
                <p className="text-sm opacity-80 mt-2">{reason}</p>
              </>
            )}
          </motion.div>
        )}

        {/* CARD GRID */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cards.slice(0, 20).map((card) => {
            const isSelected = selected.find((c) => c.id === card.id);
            const disableOthers = selected.length === 2 && !isSelected;

            return (
              <motion.div
                key={card.id}
                whileHover={!disableOthers ? { scale: 1.1 } : {}}
                onClick={() => !disableOthers && handleSelect(card)}
                className={`cursor-pointer rounded-lg ${
                  isSelected ? "ring-4 ring-yellow-400 scale-105" : ""
                } ${disableOthers ? "opacity-30 pointer-events-none" : ""}`}
              >
                <img
                  src={card.images.small}
                  alt={card.name}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchPage;