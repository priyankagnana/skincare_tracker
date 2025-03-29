import React, { useState, useRef, useEffect } from "react";
import homepageAudio from "./assets/GameSelectionAudio.mp3";
import backgroundVideo from "./assets/GameIntro.mp4";
import clickSound from "./assets/Click.mp3";
import TicTacToeImage from "./assets/TicTacToe.jpeg";
import MemoryImage from "./assets/MemoryGame.jpeg";
import QuizImage from "./assets/QuizGame.jpeg";
import "./GameSelection.css";

function GameSelection({ setCurrentPage }) {

  const backgroundAudioRef = useRef(new Audio(homepageAudio));
  const [isMuted, setIsMuted] = useState(true);
  const clickAudioRef = useRef(new Audio(clickSound));

  useEffect(() => {
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.3;
    backgroundAudioRef.current.muted = isMuted;
    backgroundAudioRef.current
      .play()
      .catch((err) => console.error("Background audio play failed:", err));
    return () => {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    backgroundAudioRef.current.muted = isMuted;
    if (!isMuted) {
      backgroundAudioRef.current
        .play()
        .catch((err) => console.error("Background audio play failed:", err));
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleCardHover = () => {
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current
      .play()
      .catch((err) => console.error("Click audio play failed:", err));
  };

  return (
    <div className="game-selection">
      <video
        className="video-background"
        autoPlay
        loop
        muted
        src={backgroundVideo}
      >
        Your browser does not support the video tag.
      </video>

      <button className="mute-toggle-button" onClick={toggleMute}>
        {isMuted ? "Unmute" : "Mute"}
      </button>

      <div className="content">
        <h2>Let's see who is smart</h2>
        <div className="games">
          <div
            className="game-card"
            onClick={() => navigateTo("memory-game")}
            onMouseEnter={handleCardHover}
          >
            <img src={MemoryImage} alt="Memory Game" />
            <h3>The Memory Game</h3>
            <button>Play</button>
          </div>
          <div
            className="game-card"
            onClick={() => navigateTo("tic-tac-toe")}
            onMouseEnter={handleCardHover}
          >
            <img src={TicTacToeImage} alt="Tic Tac Toe" />
            <h3>Tic Tac Toe</h3>
            <button>Play</button>
          </div>
          <div
            className="game-card"
            onClick={() => navigateTo("quiz-game")}
            onMouseEnter={handleCardHover}
          >
            <img src={QuizImage} alt="Quiz Game" />
            <h3>Quiz</h3>
            <button>Play</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSelection;
