import React, { useEffect, useRef, useState } from "react";

const SIZE = 20;

export default function App() {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [dir, setDir] = useState([0, 1]);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(
    Number(localStorage.getItem("bestScore") || 0)
  );

  const dirRef = useRef(dir);
  dirRef.current = dir;

  // 🎮 Keyboard
  useEffect(() => {
    const key = (e) => {
      const [dx, dy] = dirRef.current;

      if (e.key === "ArrowUp" && dx !== 1) setDir([-1, 0]);
      if (e.key === "ArrowDown" && dx !== -1) setDir([1, 0]);
      if (e.key === "ArrowLeft" && dy !== 1) setDir([0, -1]);
      if (e.key === "ArrowRight" && dy !== -1) setDir([0, 1]);
      if (e.key === " ") setPaused((p) => !p);
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  // 🍎 Spawn food safely
  const spawnFood = (currentSnake) => {
    let f;
    do {
      f = [
        Math.floor(Math.random() * SIZE),
        Math.floor(Math.random() * SIZE),
      ];
    } while (currentSnake.some((s) => s[0] === f[0] && s[1] === f[1]));
    setFood(f);
  };

  // ⏱ Game loop with ref (no re-render bug)
  const loopRef = useRef();

  useEffect(() => {
    if (over || paused) return;

    const speed = Math.max(60, 160 - score * 4);

    loopRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = [
          prev[0][0] + dirRef.current[0],
          prev[0][1] + dirRef.current[1],
        ];

        // ❌ Collision
        if (
          head[0] < 0 ||
          head[1] < 0 ||
          head[0] >= SIZE ||
          head[1] >= SIZE ||
          prev.some((s) => s[0] === head[0] && s[1] === head[1])
        ) {
          setOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // 🍎 Eat
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => {
            const newScore = s + 1;
            if (newScore > best) {
              setBest(newScore);
              localStorage.setItem("bestScore", newScore);
            }
            return newScore;
          });
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(loopRef.current);
  }, [food, score, over, paused, best]);

  const restart = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    setDir([0, 1]);
    setOver(false);
    setPaused(false);
    setScore(0);
  };

  return (
    <div className="container">
      <h1>🐍 Jeu Lf3a Pro</h1>
      <h2>Score: {score} | Best: {best}</h2>
      {over && <h2 style={{ color: "red" }}>Game Over</h2>}
      {paused && <h2 style={{ color: "orange" }}>Paused</h2>}

      <div className="board">
        {[...Array(SIZE)].map((_, r) =>
          [...Array(SIZE)].map((_, c) => {
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
      <p>🎮 Flèches pour jouer — Espace pour Pause</p>
    </div>
  );
}