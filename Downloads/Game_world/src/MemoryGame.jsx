import React, { useState, useRef, useEffect } from "react";
import "./MemoryGame.css";
import MemoryGameBg from "./assets/MemoryGameBg.jpeg";
import MemoryAud from "./assets/MemoryAud.mp3";
import Elon from "./assets/ElonMusk.jpg";
import Bill from "./assets/BillGates.jpg";
import Mark from "./assets/MarkZukerburg.jpg";
import Jeff from "./assets/JeffBezos.webp";
import Steve from "./assets/steve-jobs.jpg";
import Sunder from "./assets/SunderPichai.jpg";

const images = [Elon, Bill, Mark, Jeff, Steve, Sunder];
const initialCards = [...images, ...images].sort(() => Math.random() - 0.5);

function MemoryGame({ setCurrentPage }) {
  const [cards, setCards] = useState(
    initialCards.map((img) => ({ img, flipped: false, matched: false }))
  );
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [gameWon, setGameWon] = useState(false);

  const memoryAudRef = useRef(new Audio(MemoryAud));

  useEffect(() => {
    memoryAudRef.current.loop = true;
    memoryAudRef.current.volume = 0.3;
    memoryAudRef.current.muted = isMuted;
    memoryAudRef.current.play().catch((err) =>
      console.error("Memory audio play failed:", err)
    );
    return () => {
      memoryAudRef.current.pause();
      memoryAudRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    memoryAudRef.current.muted = isMuted;
    if (!isMuted) {
      memoryAudRef.current.play().catch((err) =>
        console.error("Memory audio play failed:", err)
      );
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleRules = () => {
    setShowRules((prev) => !prev);
  };

  const handleClick = (index) => {
    if (cards[index].flipped || selected.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      setTimeout(() => {
        const [first, second] = newSelected;
        if (newCards[first].img === newCards[second].img) {
          newCards[first].matched = true;
          newCards[second].matched = true;
        } else {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
        }
        setCards([...newCards]);
        setSelected([]);
      }, 800);
    }
  };

  // Check for win condition
  useEffect(() => {
    if (cards.every((card) => card.matched === true)) {
      setGameWon(true);
    }
  }, [cards]);

  const restartGame = () => {
    const resetCards = initialCards
      .sort(() => Math.random() - 0.5)
      .map((img) => ({ img, flipped: false, matched: false }));
    setCards(resetCards);
    setSelected([]);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <div className="memory-game">
      <div
        className="memory-background"
        style={{ backgroundImage: `url(${MemoryGameBg})` }}
      ></div>

      <div className="header-bar">
        <div className="left-controls">
          <button className="back-button" onClick={() => setCurrentPage("games")}>
            ← Back
          </button>
          <button className="info-button" onClick={toggleRules}>
            ℹ️
          </button>
        </div>
        <button className="mute-toggle-button" onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      <div className="memory-content">
        <h2>Memory Game</h2>
        <p className="moves-counter">Moves: {moves}</p>
        <div className="grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${card.flipped ? "flipped" : ""} ${
                card.matched ? "matched" : ""
              }`}
              onClick={() => handleClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">
                  <img src={card.img} alt="Character" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {gameWon && (
        <div className="win-overlay">
          <div className="win-card">
            <h2>Congratulations!</h2>
            <p>You won in {moves} moves!</p>
            <button className="restart-btn" onClick={restartGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {showRules && (
        <div className="rules-overlay">
          <div className="rules-card">
            <h3>Game Rules</h3>
            <ul>
              <li>Click on two cards to reveal them.</li>
              <li>If they match, they stay flipped.</li>
              <li>If they do not match, they flip back after a short delay.</li>
              <li>Try to match all the cards with as few moves as possible.</li>
            </ul>
            <button className="close-btn" onClick={toggleRules}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
