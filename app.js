/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const wordList = [
  "sharingan", 
  "totoro", 
  "avengers", 
  "hogwarts", 
  "pokemon", 
  "shinobi", 
  "jedi", 
  "saiyan", 
  "titan", 
  "ghibli"
];

function ScrambleGame() {
  const [words, setWords] = React.useState(() => {
    const saved = localStorage.getItem("scramble_words");
    return saved ? JSON.parse(saved) : shuffle(wordList);
  });

  const [currentIndex, setCurrentIndex] = React.useState(() => {
    const saved = localStorage.getItem("scramble_index");
    return saved ? parseInt(saved) : 0;
  });

  const [points, setPoints] = React.useState(() => {
    const saved = localStorage.getItem("scramble_points");
    return saved ? parseInt(saved) : 0;
  });

  const [strikes, setStrikes] = React.useState(() => {
    const saved = localStorage.getItem("scramble_strikes");
    return saved ? parseInt(saved) : 0;
  });

  const [passes, setPasses] = React.useState(() => {
    const saved = localStorage.getItem("scramble_passes");
    return saved ? parseInt(saved) : 3;
  });

  const [userInput, setUserInput] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem("scramble_words", JSON.stringify(words));
    localStorage.setItem("scramble_index", currentIndex);
    localStorage.setItem("scramble_points", points);
    localStorage.setItem("scramble_strikes", strikes);
    localStorage.setItem("scramble_passes", passes);
  }, [words, currentIndex, points, strikes, passes]);

  const maxStrikes = 3;
  const isGameOver = strikes >= maxStrikes || currentIndex >= words.length;
  const currentWord = words[currentIndex] || "";
  
  const scrambled = React.useMemo(() => (currentWord ? shuffle(currentWord) : ""), [currentWord]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (userInput.toLowerCase().trim() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setMessage("Correct!");
      setCurrentIndex(currentIndex + 1);
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect!");
    }
    setUserInput("");
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      setCurrentIndex(currentIndex + 1);
      setMessage("Passed!");
    }
  };

  const resetGame = () => {
    const newShuffled = shuffle(wordList);
    setWords(newShuffled);
    setCurrentIndex(0);
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage("");
    setUserInput("");
    localStorage.clear();
  };

  // if (isGameOver) {
  //   return (
  //     <div className="game-container">
  //       <h1>Game Over</h1>
  //       <p>Final Score: {points}</p>
  //       <button onClick={resetGame}>Play Again</button>
  //     </div>
  //   );
  // }
  if (isGameOver) {
    const hasWon = strikes < maxStrikes && currentIndex >= words.length;

    return (
      <div className="game-container">
        <h1>{hasWon ? "You Won! 🎉" : "Game Over 💀"}</h1>
        
        <div className="stats">
          <p>Final Score: {points}</p>
          <p>{hasWon 
            ? "Congratulations! You guessed all the words." 
            : "Better luck next time!"}
          </p>
        </div>

        <button onClick={resetGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>Scramble Game</h1>
      <div className="stats">
        <p>Points: {points} | Strikes: {strikes}/{maxStrikes} | Passes: {passes}</p>
      </div>
      
      <div className="scramble-box">
        <h2>{scrambled}</h2>
      </div>

      <form onSubmit={handleGuess}>
        <input 
          type="text" 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)} 
          placeholder="Guess the word"
          autoFocus
        />
        <button type="submit">Enter</button>
      </form>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePass} disabled={passes <= 0}>Pass Word</button>
      </div>
      
      <p>{message}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ScrambleGame />);