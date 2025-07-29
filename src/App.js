import { useEffect, useState } from "react";
import "./App.css";

const WORDLE_API_URL = "/wordle.json";
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver == false) {
      const fetchWords = async () => {
        const response = await fetch(WORDLE_API_URL);

        const words = await response.json();

        setSolution(words[Math.floor(Math.random() * words.length)]);
      };

      fetchWords();
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyboardEvent = (event) => {
      if (gameOver) {
        return;
      }
      if (event.key == "Enter") {
        if (currentGuess.length !== WORD_LENGTH) {
          return;
        }

        console.log(guesses.filter((val) => val != null).length);

        if (
          solution.toLocaleLowerCase() === currentGuess ||
          guesses.filter((val) => val != null).length === MAX_GUESSES - 1
        ) {
          setGameOver(true);
          //return;
        }
        const newGuesses = [...guesses];

        newGuesses[newGuesses.findIndex((val) => val === null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");
        return;
      }

      if (event.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (currentGuess.length < WORD_LENGTH) {
        const match = event.key.toLowerCase().match(/^[a-z]{1}$/);

        setCurrentGuess((prev) => prev + match);
      }
    };

    window.addEventListener("keydown", handleKeyboardEvent);

    return () => window.removeEventListener("keydown", handleKeyboardEvent);
  }, [currentGuess, solution, gameOver]);

  const restartGame = () => {
    setGuesses(Array(MAX_GUESSES).fill(null));
    setCurrentGuess("");
    setSolution("");
    setGameOver(false);
  };

  return (
    <div className="grid">
      <h1 className="heading">Wordle</h1>
      <p>
        Guess the <strong>word!</strong>
      </p>
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val === null);

        return (
          <Row
            key={i}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
            solution={solution.toLowerCase()}
            isFinal={!isCurrentGuess && guess !== null}
          />
        );
      })}
      {gameOver && (
        <button className="restart-btn" onClick={restartGame}>
          Restart
        </button>
      )}
    </div>
  );
}

function Row({ guess, solution, isFinal }) {
  const cells = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    let className = "cell";
    let char = guess[i];

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " present";
      } else {
        className += " incorrect";
      }
    }

    cells.push(
      <div key={i} className={className}>
        {guess[i]}
      </div>
    );
  }
  return <div className="row">{cells}</div>;
}
export default App;
