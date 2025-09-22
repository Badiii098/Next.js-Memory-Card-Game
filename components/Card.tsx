"use client";
import React from "react";

type Props = {
  symbol: string;
  flipped: boolean;
  onClick: () => void;
};

export default function Card({ symbol, flipped, onClick }: Props) {
  return (
    <div className={`card ${flipped ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-face card-back">❓</div>
        <div className="card-face card-front">{symbol}</div>
      </div>
    </div>
  );
}
