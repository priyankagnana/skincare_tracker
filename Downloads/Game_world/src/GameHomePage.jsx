import { useEffect, useState, useRef } from "react";
import typingSound from "./assets/typing.mp3";
import homepageAudio from "./assets/HomePageAudio.mp3";
import backgroundVideo from "./assets/HomePageBackground.mp4";
import "./GameHomepage.css";

const GameHomepage = ({setCurrentPage}) => {
  const text = "Welcome to the game world";
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [typingFinished, setTypingFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);


  const typingAudioRef = useRef(new Audio(typingSound));
  const backgroundAudioRef = useRef(new Audio(homepageAudio));
  const intervalRef = useRef(null);

  const startExperience = () => {
    setHasStarted(true);

    typingAudioRef.current.muted = false;
    typingAudioRef.current.loop = false;
    typingAudioRef.current.volume = 0.5;
    typingAudioRef.current.play().catch((err) =>
      console.error("Typing audio play failed:", err)
    );

    backgroundAudioRef.current.muted = isMuted;
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.3;
    backgroundAudioRef.current.play().catch((err) =>
      console.error("Background audio play failed:", err)
    );

    let index = 0;
    intervalRef.current = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedText(text.substring(0, index));
      } else {
        clearInterval(intervalRef.current);
        setTypingFinished(true);
        typingAudioRef.current.pause();
      }
    }, 150);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      backgroundAudioRef.current.muted = newMutedState;
      return newMutedState;
    });
  };

  const handleContinueClick = () => {
    setCurrentPage('games');
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      typingAudioRef.current.pause();
      backgroundAudioRef.current.pause();
      typingAudioRef.current.currentTime = 0;
      backgroundAudioRef.current.currentTime = 0;
    };
  }, []);

  return (
    <div className="container">
      <video className="video-background" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {hasStarted && (
        <button className="mute-toggle-button" onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      )}

      <div className="content">
        {!hasStarted && (
          <button className="start-experience-button" onClick={startExperience}>
            Start Experience
          </button>
        )}

        {hasStarted && (
          <div className="typing-container">
            <div className="heading">{displayedText}</div>
          </div>
        )}

        {typingFinished && (
          <button className="continue-button" onClick={handleContinueClick}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default GameHomepage;
