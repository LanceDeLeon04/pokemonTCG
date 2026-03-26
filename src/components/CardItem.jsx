import React from "react";
import { motion } from "framer-motion";

const CARD_BACK = "https://i.imgur.com/6nI3oVt.png";

const CardItem = ({ card, flip, pos, onClick }) => {
  if (!card?.images?.small) return null;

  return (
    <motion.div
      className="w-36 h-52 perspective-1000 absolute cursor-pointer"
      animate={{
        x: pos?.x || 0,
        y: pos?.y || 0,
        rotateY: flip ? 180 : 0,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onClick={() => onClick(card)}
    >
      <div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute w-full h-full rounded shadow overflow-hidden bg-white flex flex-col backface-hidden"
          style={{ transform: "rotateY(0deg)", backfaceVisibility: "hidden" }}
        >
          <img
            src={card.images.small}
            alt={card.name}
            className="w-full h-3/4 object-cover"
          />
          <div className="p-1 flex flex-col items-center justify-center h-1/4">
            <h2 className="text-xs font-bold">{card.name}</h2>
            <p className="text-[10px] text-gray-600">{card.types?.join(", ")}</p>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute w-full h-full rounded flex justify-center items-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <img
            src={CARD_BACK}
            alt="back"
            className="w-full h-full object-cover rounded"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CardItem;