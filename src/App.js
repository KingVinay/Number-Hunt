import React, { useState } from "react";

const difficultyLevels = {
  Easy: { range: 50, attempts: 10 },
  Medium: { range: 100, attempts: 7 },
  Hard: { range: 200, attempts: 5 },
};

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numberToGuess, setNumberToGuess] = useState(
    generateRandomNumber("Medium")
  );
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Guess a number");
  const [attemptsLeft, setAttemptsLeft] = useState(
    difficultyLevels["Medium"].attempts
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  function generateRandomNumber(level) {
    return Math.floor(Math.random() * difficultyLevels[level].range) + 1;
  }

  const handleGuess = () => {
    if (gameOver || guess === "") return;
    const userGuess = parseInt(guess);
    setAttemptsLeft((prev) => prev - 1);

    if (userGuess === numberToGuess) {
      setMessage(`🎉 Correct! The number was ${numberToGuess}`);
      const finalScore = score + attemptsLeft * 10;
      setScore(finalScore);
      updateLeaderboard(playerName, finalScore);
      setGameOver(true);
    } else if (userGuess < numberToGuess) {
      setMessage("🔼 Too low! Try again.");
    } else {
      setMessage("🔽 Too high! Try again.");
    }

    if (attemptsLeft - 1 === 0) {
      setMessage(`❌ Out of attempts! The number was ${numberToGuess}`);
      setGameOver(true);
    }
  };

  const updateLeaderboard = (name, newScore) => {
    setLeaderboard((prev) =>
      [...prev, { name, score: newScore }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
    );
  };

  const handleRestart = () => {
    setNumberToGuess(generateRandomNumber(difficulty));
    setGuess("");
    setPlayerName("");
    setMessage("Guess a number");
    setAttemptsLeft(difficultyLevels[difficulty].attempts);
    setGameOver(false);
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    setNumberToGuess(generateRandomNumber(level));
    setAttemptsLeft(difficultyLevels[level].attempts);
    setGameOver(false);
    setMessage("Guess a number");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-6 text-center shadow-xl w-96 rounded-2xl mb-6">
        <h1 className="text-xl font-bold mb-4">Guess The Number</h1>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="mb-4 border p-2 w-full"
        />
        <p className="mb-2 text-lg">{message}</p>
        <p className="text-sm text-gray-600">Attempts left: {attemptsLeft}</p>
        <p className="text-sm text-gray-600">Score: {score}</p>
        <div className="mb-4">
          {Object.keys(difficultyLevels).map((level) => (
            <button
              key={level}
              onClick={() => handleDifficultyChange(level)}
              className={`mr-2 p-2 border rounded ${
                difficulty === level ? "bg-blue-500 text-white" : ""
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={gameOver}
          placeholder="Enter your guess"
          className="mt-2 border p-2 w-full"
        />
        <button
          onClick={handleGuess}
          className="mt-4 mr-3 p-2 bg-gray-300 rounded"
          disabled={gameOver || !playerName}
        >
          Submit Guess
        </button>
        {gameOver && (
          <button
            onClick={handleRestart}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Play Again
          </button>
        )}
      </div>

      <div className="p-4 text-center shadow-xl w-80 bg-white rounded-2xl">
        <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
        <ul className="list-none">
          {leaderboard.map((entry, index) => (
            <li key={index} className="text-sm text-gray-700">
              #{index + 1}: {entry.name} - {entry.score} points
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
