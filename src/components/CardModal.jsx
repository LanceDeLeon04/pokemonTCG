import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CardModal = ({ card, open, onClose }) => {
  if (!card) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded shadow-xl w-4/5 h-4/5 flex"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {/* LEFT: Details */}
            <div className="w-1/3 p-6 overflow-y-auto border-r">
              <h2 className="text-2xl font-bold mb-2">{card.name}</h2>
              <p><strong>Type:</strong> {card.types?.join(", ")}</p>
              {card.subtypes && <p><strong>Subtypes:</strong> {card.subtypes.join(", ")}</p>}
              {card.rarity && <p><strong>Rarity:</strong> {card.rarity}</p>}
              {card.attacks && (
                <div>
                  <strong>Attacks:</strong>
                  <ul>
                    {card.attacks.map((atk) => (
                      <li key={atk.name}>
                        {atk.name} ({atk.damage} dmg) - {atk.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {card.weaknesses && (
                <p><strong>Weakness:</strong> {card.weaknesses.map(w => `${w.type} x${w.value}`).join(", ")}</p>
              )}
            </div>

            {/* RIGHT: Card Image */}
            <div className="w-2/3 flex justify-center items-center p-6">
              <img
                src={card.images.large || card.images.small}
                alt={card.name}
                className="max-h-full max-w-full object-contain rounded shadow"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardModal;