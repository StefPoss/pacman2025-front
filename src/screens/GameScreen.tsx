// src/screens/GameScreen.tsx
import { useEffect, useState } from "react";

type GameScreenProps = {
  onBackToMenu: () => void;
};

type Position = {
  x: number;
  y: number;
};

const STEP = 16; // taille d’un déplacement en px

export default function GameScreen({ onBackToMenu }: GameScreenProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPosition((prev) => {
        let { x, y } = prev;

        if (event.key === "ArrowUp") {
          y -= STEP;
        } else if (event.key === "ArrowDown") {
          y += STEP;
        } else if (event.key === "ArrowLeft") {
          x -= STEP;
        } else if (event.key === "ArrowRight") {
          x += STEP;
        } else {
          return prev;
        }

        // Limites de la zone de jeu (on clamp un peu au pif pour l’instant)
        const maxX = 640 - 32; // largeur - taille de Pacman
        const maxY = 480 - 32;

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;

        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="screen center game-screen">
      <h1 className="game-title">PACMAN RETRO</h1>

      <div className="game-area">
        <div
          className="pacman-player"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        />
      </div>

      <button onClick={onBackToMenu}>Retour au menu</button>
    </div>
  );
}
