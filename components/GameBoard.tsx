"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const baseSymbols = ["🍎","🍌","🍇","🍊","🍉","🍓","🥝","🍍"];

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameBoard() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [steps, setSteps] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);

  // init game
  useEffect(() => {
    resetGame();
  }, []);

  // timer berjalan setiap detik
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setInterval(() => {
        setTimeElapsed((t) => t + 1);
        setScore((s) => Math.max(0, s - 2)); // kurangi skor tiap detik
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  // handle flip logic
  useEffect(() => {
    if (flipped.length === 2) {
      setSteps((s) => s + 1);
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        setMatched((m) => [...m, a, b]);
        setScore((prev) => prev + 100); // +100 kalau cocok
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, cards]);

  // win condition
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setRunning(false); // stop timer
    }
  }, [matched, cards]);

  function resetGame() {
    const pairArray = [...baseSymbols, ...baseSymbols];
    const shuffled = fisherYatesShuffle(pairArray);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setSteps(0);
    setTimeElapsed(0);
    setScore(0);
    setRunning(true); // mulai game otomatis
  }

  function handleFlip(index: number) {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;
    setFlipped((prev) => [...prev, index]);
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>🍒 Memory Card Game (Next.js)</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
        <div>Steps: <strong>{steps}</strong></div>
        <div>Time: <strong>{timeElapsed}s</strong></div>
        <div>Score: <strong>{score}</strong></div>
      </div>

      <div className="grid-board" style={{ marginTop: 16 }}>
        {cards.map((sym, idx) => (
          <Card
            key={idx}
            symbol={sym}
            flipped={flipped.includes(idx) || matched.includes(idx)}
            onClick={() => handleFlip(idx)}
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={() => resetGame()} style={{ padding: "8px 12px", borderRadius: 6 }}>
          Restart
        </button>
      </div>
    </div>
  );
}
