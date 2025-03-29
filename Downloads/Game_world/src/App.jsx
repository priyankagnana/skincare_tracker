// App.jsx
import { useState } from 'react';
import GameHomepage from './GameHomePage';
import GameSelection from './GameSelection';
import TicTacToe from './TicTacToe';
import MemoryGame from './MemoryGame';
import QuizGame from './QuizGame';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <GameHomepage setCurrentPage={setCurrentPage} />;
      case 'games':
        return <GameSelection setCurrentPage={setCurrentPage} />;
      case 'tic-tac-toe':
         return <TicTacToe setCurrentPage={setCurrentPage} />
      case 'memory-game':
          return <MemoryGame setCurrentPage={setCurrentPage} />
      case 'quiz-game':
          return <QuizGame setCurrentPage={setCurrentPage}/>
      default:
        return <div>Page Not Found</div>;
    }
  };

  return <div className="app-container">{renderPage()}</div>;
}

export default App;
