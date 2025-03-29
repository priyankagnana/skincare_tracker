import React, { useState, useRef, useEffect } from "react";
import "./TicTacToe.css";
import doraemon from "./assets/Doraemon.jpg";
import pikachu from "./assets/pikachu.png";
import TicTacToeAud from "./assets/TicTacToeAud.mp3";
import TicTacToeBg from "./assets/TicTacToeBg.jpeg";

function TicTacToe({ setCurrentPage }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("doraemon");
  const [isMuted, setIsMuted] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const audioRef = useRef(new Audio(TicTacToeAud));
  
  const images = {
    doraemon: doraemon,
    pikachu: pikachu
  };

  const winningLines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  useEffect(() => {
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    audioRef.current.muted = isMuted;
    audioRef.current.play().catch((err) =>
      console.error("TicTacToe audio play failed:", err)
    );
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    audioRef.current.muted = isMuted;
    if (!isMuted) {
      audioRef.current.play().catch((err) =>
        console.error("TicTacToe audio play failed:", err)
      );
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  const calculateWinner = (board) => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // returns "doraemon" or "pikachu"
      }
    }
    return null;
  };

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setGameResult(winner);
    } else if (board.every((cell) => cell !== null)) {
      setGameResult("tie");
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || gameResult) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    setTurn(turn === "doraemon" ? "pikachu" : "doraemon");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("doraemon");
    setGameResult(null);
  };

  return (
    <div className="tic-tac-toe">
      <div
        className="tic-tac-toe-bg"
        style={{ backgroundImage: `url(${TicTacToeBg})` }}
      ></div>

      {/* Header Bar */}
      <div className="header-bar">
        <div className="left-controls">
          <button className="back-button" onClick={() => setCurrentPage('games')}>
            ← Back
          </button>
          <button className="info-button" onClick={toggleInfo}>
            ℹ️
          </button>
        </div>
        <button className="mute-toggle-button" onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      {/* Game Content */}
      <div className="tic-tac-toe-content">
        <h2>Doraemon vs Pikachu</h2>
        <div className="board">
          {board.map((cell, index) => (
            <div key={index} className="cell" onClick={() => handleClick(index)}>
              {cell ? (
                <img src={images[cell]} alt={cell} />
              ) : (
                <span className="placeholder">?</span>
              )}
            </div>
          ))}
        </div>
        <button className="restart-btn" onClick={resetGame}>
          Restart
        </button>
      </div>

      {/* Outcome Overlay */}
      {gameResult && (
        <div className="result-overlay">
          <div className="result-card">
            {gameResult === "tie" ? (
              <h2>It's a Tie!</h2>
            ) : (
              <h2>{gameResult === "doraemon" ? "Doraemon" : "Pikachu"} Wins!</h2>
            )}
            <button className="restart-btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Info/Rules Overlay */}
      {showInfo && (
        <div className="rules-overlay">
          <div className="rules-card">
            <h3>Game Rules</h3>
            <ul>
              <li>Players take turns placing their symbol on the board.</li>
              <li>Doraemon and Pikachu alternate turns.</li>
              <li>First to get three in a row wins.</li>
              <li>If all cells are filled with no winner, it's a tie.</li>
            </ul>
            <button className="close-btn" onClick={toggleInfo}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
