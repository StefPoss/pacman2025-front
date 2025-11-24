// src/screens/GameScreen.tsx
import { useEffect, useState } from "react";
import { LEVEL_1 } from "../levels/level1";

type GameScreenProps = {
  onBackToMenu: () => void;
};

type Position = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right" | null;

type GameState = {
  grid: string[];
  pacman: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
};

const TILE_SIZE = 24; // taille d'une case en px
const STEP_MS = 120;  // vitesse : 1 case tous les 120 ms

const directionFromKey: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export default function GameScreen({ onBackToMenu }: GameScreenProps) {
  // Niveau texte -> grille modifiable (on enlève le P)
  const createInitialGrid = (): string[] =>
    LEVEL_1.map((row) => row.replace("P", " "));

  const findInitialPacman = (): Position => {
    for (let y = 0; y < LEVEL_1.length; y++) {
      const row = LEVEL_1[y];
      const x = row.indexOf("P");
      if (x !== -1) return { x, y };
    }
    return { x: 1, y: 1 };
  };

  const [state, setState] = useState<GameState>(() => ({
    grid: createInitialGrid(),
    pacman: findInitialPacman(),
    direction: null,
    nextDirection: null,
    score: 0,
  }));

  // Gestion du clavier : on ne déplace PLUS Pacman ici,
  // on met juste à jour la direction / nextDirection.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = directionFromKey[e.key];
      if (!dir) return;
  
      e.preventDefault();
  
      setState((prev) => {
        // Pacman à l'arrêt → il part tout de suite dans cette direction
        if (prev.direction === null) {
          return { ...prev, direction: dir, nextDirection: dir };
        }
        // Sinon : on mémorise cette direction comme prochaine direction
        return { ...prev, nextDirection: dir };
      });
    };
  
    const handleKeyUp = (e: KeyboardEvent) => {
      const dir = directionFromKey[e.key];
      if (!dir) return;
  
      setState((prev) => {
        // ❗ On n'arrête Pacman QUE si on relâche la flèche
        // qui correspond à la direction ACTUELLE ET à la direction "next"
        if (prev.direction === dir && prev.nextDirection === dir) {
          return { ...prev, direction: null, nextDirection: null };
        }
        // Sinon, on ne touche à rien (par ex : on relâche l'ancienne direction)
        return prev;
      });
    };
  
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  
  

  // Boucle de jeu : avance Pacman d'une case à vitesse constante
  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((prev) => {
        const { grid, pacman, direction, nextDirection, score } = prev;

        const canMoveTo = (x: number, y: number): boolean => {
          if (y < 0 || y >= grid.length) return false;
          if (x < 0 || x >= grid[y].length) return false;
          return grid[y][x] !== "#";
        };

        const moveOnce = (
          dir: Direction,
          pos: Position,
          gridIn: string[],
          scoreIn: number
        ) => {
          if (!dir) {
            return {
              moved: false,
              pos,
              grid: gridIn,
              score: scoreIn,
            };
          }

          let dx = 0;
          let dy = 0;
          if (dir === "up") dy = -1;
          if (dir === "down") dy = 1;
          if (dir === "left") dx = -1;
          if (dir === "right") dx = 1;

          const nx = pos.x + dx;
          const ny = pos.y + dy;

          if (!canMoveTo(nx, ny)) {
            return {
              moved: false,
              pos,
              grid: gridIn,
              score: scoreIn,
            };
          }

          let newGrid = gridIn;
          let newScore = scoreIn;

          const cell = gridIn[ny][nx];
          if (cell === ".") {
            newScore += 10;
            const row = gridIn[ny];
            const newRow = row.substring(0, nx) + " " + row.substring(nx + 1);
            newGrid = [...gridIn];
            newGrid[ny] = newRow;
          }

          return {
            moved: true,
            pos: { x: nx, y: ny },
            grid: newGrid,
            score: newScore,
          };
        };

        let newDir = direction;
        let newNext = nextDirection;
        let newPos = pacman;
        let newGrid = grid;
        let newScore = score;

        // 1. Priorité à la prochaine direction demandée (pour bien prendre les virages)
        if (nextDirection) {
          const res = moveOnce(nextDirection, newPos, newGrid, newScore);
          if (res.moved) {
            newDir = nextDirection;
            newPos = res.pos;
            newGrid = res.grid;
            newScore = res.score;

            return {
              grid: newGrid,
              pacman: newPos,
              direction: newDir,
              nextDirection: newNext,
              score: newScore,
            };
          }
        }

        // 2. Sinon, on continue dans la direction actuelle
        if (direction) {
          const res = moveOnce(direction, newPos, newGrid, newScore);
          if (res.moved) {
            newPos = res.pos;
            newGrid = res.grid;
            newScore = res.score;
          }
        }

        return {
          grid: newGrid,
          pacman: newPos,
          direction: newDir,
          nextDirection: newNext,
          score: newScore,
        };
      });
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, []);

  const { grid, pacman, score } = state;

  return (
    <div className="screen center">
      <h1 className="game-title">PACMAN RETRO</h1>

      <div className="game-hud">
        <span>SCORE : {score}</span>
      </div>

      <div
        className="grid"
        style={{
          width: grid[0].length * TILE_SIZE,
          height: grid.length * TILE_SIZE,
        }}
      >
        {grid.map((row, y) =>
          row.split("").map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={
                cell === "#"
                  ? "tile wall"
                  : cell === "."
                  ? "tile dot"
                  : "tile empty"
              }
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
              }}
            />
          ))
        )}

        <div
          className="pacman"
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            transform: `translate(${pacman.x * TILE_SIZE}px, ${
              pacman.y * TILE_SIZE
            }px)`,
          }}
        />
      </div>

      <button onClick={onBackToMenu}>Retour au menu</button>
    </div>
  );
}
