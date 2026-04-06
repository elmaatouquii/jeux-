import React, { useEffect, useState } from "react";

const size = 20;

export default function App() {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [dir, setDir] = useState([0, 1]);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "ArrowUp") setDir([-1, 0]);
      if (e.key === "ArrowDown") setDir([1, 0]);
      if (e.key === "ArrowLeft") setDir([0, -1]);
      if (e.key === "ArrowRight") setDir([0, 1]);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    if (over) return;
    const t = setInterval(move, 180);
    return () => clearInterval(t);
  });

  const move = () => {
    const head = [snake[0][0] + dir[0], snake[0][1] + dir[1]];

    if (
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= size ||
      head[1] >= size ||
      snake.some((s) => s[0] === head[0] && s[1] === head[1])
    ) {
      setOver(true);
      return;
    }

    const newSnake = [head, ...snake];

    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(score + 1);
      setFood([
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size),
      ]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const restart = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    setDir([0, 1]);
    setOver(false);
    setScore(0);
  };

  return (
    <div className="container">
      <h1>🐍 Jeu </h1>
      <h2>Score: {score}</h2>
      {over && <h2>Game Over</h2>}
      <div className="board">
        {[...Array(size)].map((_, r) =>
          [...Array(size)].map((_, c) => {
            const s = snake.some((x) => x[0] === r && x[1] === c);
            const f = food[0] === r && food[1] === c;
            return (
              <div
                key={r + "-" + c}
                className={`cell ${s ? "snake" : ""} ${f ? "food" : ""}`}
              />
            );
          })
        )}
      </div>
      <button onClick={restart}>Restart</button>
    </div>
  );
}