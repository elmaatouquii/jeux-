import React, { useEffect, useRef, useState } from "react";

const size = 20;

export default function App() {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [dir, setDir] = useState([0, 1]);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  // Keyboard control (no reverse)
  useEffect(() => {
    const key = (e) => {
      const [dx, dy] = dirRef.current;

      if (e.key === "ArrowUp" && dx !== 1) setDir([-1, 0]);
      if (e.key === "ArrowDown" && dx !== -1) setDir([1, 0]);
      if (e.key === "ArrowLeft" && dy !== 1) setDir([0, -1]);
      if (e.key === "ArrowRight" && dy !== -1) setDir([0, 1]);
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  // Game loop (speed increases)
  useEffect(() => {
    if (over) return;

    const speed = Math.max(70, 180 - score * 5);

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = [
          prev[0][0] + dirRef.current[0],
          prev[0][1] + dirRef.current[1],
        ];

        // Collision
        if (
          head[0] < 0 ||
          head[1] < 0 ||
          head[0] >= size ||
          head[1] >= size ||
          prev.some((s) => s[0] === head[0] && s[1] === head[1])
        ) {
          setOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => s + 1);

          // New food not on snake
          let newFood;
          do {
            newFood = [
              Math.floor(Math.random() * size),
              Math.floor(Math.random() * size),
            ];
          } while (
            newSnake.some((s) => s[0] === newFood[0] && s[1] === newFood[1])
          );

          setFood(newFood);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [food, over, score]);

  const restart = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    setDir([0, 1]);
    setOver(false);
    setScore(0);
  };

  return (
    <div className="container">
      <h1>🐍 Jeu Lf3a</h1>
      <h2>Score: {score}</h2>
      {over && <h2 style={{ color: "red" }}>Game Over</h2>}

      <div className="board">
        {[...Array(size)].map((_, r) =>
          [...Array(size)].map((_, c) => {
            const isSnake = snake.some((x) => x[0] === r && x[1] === c);
            const isFood = food[0] === r && food[1] === c;

            return (
              <div
                key={r + "-" + c}
                className={`cell ${isSnake ? "snake" : ""} ${
                  isFood ? "food" : ""
                }`}
              />
            );
          })
        )}
      </div>

      <button onClick={restart}>Restart</button>
    </div>
  );
}