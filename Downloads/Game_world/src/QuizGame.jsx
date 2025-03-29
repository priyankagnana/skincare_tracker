import React, { useState, useRef, useEffect } from "react";
import Quizbg from "./assets/Quizbg.jpeg";
import quizAudio from "./assets/QuizAud.mp3";
import "./QuizGame.css";

const questions = [
  { 
    question: "I speak without a mouth and hear without ears. What am I?", 
    options: ["Echo", "Shadow", "Wind"], 
    answer: "Echo" 
  },
  { 
    question: "The more you take, the more you leave behind. What am I?", 
    options: ["Footsteps", "Memories", "Shadows"], 
    answer: "Footsteps" 
  },
  { 
    question: "I am always running, but never move. What am I?", 
    options: ["Clock", "River", "Car"], 
    answer: "Clock" 
  },
  { 
    question: "What has keys but can’t open locks?", 
    options: ["Piano", "Treasure Chest", "Computer"], 
    answer: "Piano" 
  },
  { 
    question: "I fly without wings. I cry without eyes. What am I?", 
    options: ["Cloud", "Tornado", "Wind"], 
    answer: "Cloud" 
  },
  { 
    question: "The more you share me, the less you have. What am I?", 
    options: ["Secret", "Love", "Money"], 
    answer: "Secret" 
  },
  { 
    question: "I have cities but no houses, forests but no trees. What am I?", 
    options: ["Map", "Book", "Dream"], 
    answer: "Map" 
  },
  { 
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?", 
    options: ["The letter M", "A heartbeat", "A blink"], 
    answer: "The letter M" 
  },
  { 
    question: "What is full of holes but still holds water?", 
    options: ["Sponge", "Bucket", "Net"], 
    answer: "Sponge" 
  },
  { 
    question: "The more you remove from me, the bigger I get. What am I?", 
    options: ["Hole", "Balloon", "Puzzle"], 
    answer: "Hole" 
  }
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function QuizGame({ setCurrentPage }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showRules, setShowRules] = useState(false);

  const quizAudioRef = useRef(new Audio(quizAudio));

  useEffect(() => {
    quizAudioRef.current.loop = true;
    quizAudioRef.current.volume = 0.3;
    quizAudioRef.current.muted = isMuted;
    quizAudioRef.current
      .play()
      .catch((err) => console.error("Quiz audio play failed:", err));
    return () => {
      quizAudioRef.current.pause();
      quizAudioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    quizAudioRef.current.muted = isMuted;
    if (!isMuted) {
      quizAudioRef.current.play().catch((err) =>
        console.error("Quiz audio play failed:", err)
      );
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleRules = () => {
    setShowRules((prev) => !prev);
  };

  useEffect(() => {
    if (!gameOver) {
      const options = questions[currentQuestion].options;
      setShuffledOptions(shuffleArray(options));
    }
  }, [currentQuestion, gameOver]);

  const handleAnswer = (option) => {
    if (option === questions[currentQuestion].answer) {
      setScore((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => {
        const newWrong = prev + 1;
        if (newWrong === 3) {
          setGameOver(true);
        }
        return newWrong;
      });
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length && wrongAnswers < 2) {
      setCurrentQuestion(nextQuestion);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setWrongAnswers(0);
    setGameOver(false);
  };

  const progressPercent = (currentQuestion / questions.length) * 100;

  return (
    <div className="quiz-game">
      <div
        className="quiz-background"
        style={{ backgroundImage: `url(${Quizbg})` }}
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

      <div className="quiz-content fade-in">
        <div className="hearts-container">
          {[...Array(3 - wrongAnswers)].map((_, i) => (
            <span key={i} className="heart fade-in">❤️</span>
          ))}
        </div>

        <h2>Riddle Quiz</h2>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        {gameOver ? (
          <div className="result fade-in">
            <h3>Game Over!</h3>
            <p>Your Score: {score}</p>
            <button className="restart-btn" onClick={restartGame}>
              Restart
            </button>
          </div>
        ) : (
          <div className="question-section fade-in">
            <h3>{questions[currentQuestion].question}</h3>
            <div className="options">
              {shuffledOptions.map((option, index) => (
                <button key={index} onClick={() => handleAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showRules && (
        <div className="rules-overlay fade-in">
          <div className="rules-card">
            <h3>Quiz Rules</h3>
            <ul>
              <li>Each question is a riddle with three possible answers.</li>
              <li>Select the correct answer to score a point.</li>
              <li>You can only make 2 mistakes. On the 3rd wrong answer, the game ends.</li>
              <li>The order of answers is randomized for each question.</li>
              <li>A progress bar shows your current progress through the quiz.</li>
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

export default QuizGame;
