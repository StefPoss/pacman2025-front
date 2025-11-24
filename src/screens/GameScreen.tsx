// src/screens/GameScreen.tsx
import { useEffect, useState } from "react";
import { LEVEL_1 } from "../levels/level1";

type GameScreenProps = {
  onBackToMenu: () => void;
};

type Position = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right" | null;

type Ghost = {
  id: string;
  position: Position;
  direction: Direction;
  color: string;
};

type GameState = {
  grid: string[];
  pacman: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  lives: number;
  remainingDots: number;
  hasWon: boolean;
  ghosts: Ghost[];
  isGameOver: boolean;
  ghostStepCounter: number;
  respawnCooldownMs: number;
};

const TILE_SIZE = 24;
const STEP_MS = 120;          // tick du jeu
const GHOST_STEP_FACTOR = 3;  // fantômes plus lents

const directionFromKey: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

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

const countDots = (grid: string[]): number =>
  grid.reduce(
    (acc, row) => acc + row.split("").filter((c) => c === ".").length,
    0
  );

const createInitialGhosts = (): Ghost[] => [
  {
    id: "blinky",
    position: { x: 13, y: 5 },
    direction: "left",
    color: "#ff4b4b",
  },
  {
    id: "pinky",
    position: { x: 14, y: 5 },
    direction: "right",
    color: "#ff9ad5",
  },
  {
    id: "inky",
    position: { x: 12, y: 6 },
    direction: "up",
    color: "#4bffff",
  },
  {
    id: "clyde",
    position: { x: 15, y: 6 },
    direction: "down",
    color: "#ffb84b",
  },
];

const canMoveToInGrid = (grid: string[], x: number, y: number): boolean => {
  if (y < 0 || y >= grid.length) return false;
  if (x < 0 || x >= grid[y].length) return false;
  return grid[y][x] !== "#";
};

const oppositeDirection = (dir: Direction): Direction => {
  if (dir === "up") return "down";
  if (dir === "down") return "up";
  if (dir === "left") return "right";
  if (dir === "right") return "left";
  return null;
};

const moveGhostRandomly = (ghost: Ghost, grid: string[]): Ghost => {
  const { position, direction } = ghost;
  const candidates: { dir: Direction; x: number; y: number }[] = [];

  const tryDir = (dir: Direction, dx: number, dy: number) => {
    const nx = position.x + dx;
    const ny = position.y + dy;
    if (canMoveToInGrid(grid, nx, ny)) {
      candidates.push({ dir, x: nx, y: ny });
    }
  };

  tryDir("up", 0, -1);
  tryDir("down", 0, 1);
  tryDir("left", -1, 0);
  tryDir("right", 1, 0);

  if (candidates.length === 0) {
    return ghost;
  }

  const opposite = oppositeDirection(direction);
  const filtered =
    direction && candidates.length > 1
      ? candidates.filter((c) => c.dir !== opposite)
      : candidates;

  const options = filtered.length > 0 ? filtered : candidates;
  const choice = options[Math.floor(Math.random() * options.length)];

  return {
    ...ghost,
    position: { x: choice.x, y: choice.y },
    direction: choice.dir,
  };
};

const initialGrid = createInitialGrid();
const initialGhosts = createInitialGhosts();

const initialState: GameState = {
  grid: initialGrid,
  pacman: findInitialPacman(),
  direction: null,
  nextDirection: null,
  score: 0,
  lives: 3,
  remainingDots: countDots(initialGrid),
  hasWon: false,
  ghosts: initialGhosts,
  isGameOver: false,
  ghostStepCounter: 0,
  respawnCooldownMs: 0,
};

export default function GameScreen({ onBackToMenu }: GameScreenProps) {
  const [state, setState] = useState<GameState>(initialState);

  // -------- CLAVIER --------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = directionFromKey[e.key];
      if (!dir) return;

      e.preventDefault();

      setState((prev) => {
        if (prev.direction === null) {
          return { ...prev, direction: dir, nextDirection: dir };
        }
        return { ...prev, nextDirection: dir };
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const dir = directionFromKey[e.key];
      if (!dir) return;

      setState((prev) => {
        if (prev.direction === dir && prev.nextDirection === dir) {
          return { ...prev, direction: null, nextDirection: null };
        }
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

  // -------- BOUCLE DE JEU --------
  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((prev) => {
        const {
          grid,
          pacman,
          direction,
          nextDirection,
          score,
          lives,
          remainingDots,
          hasWon,
          ghosts,
          isGameOver,
          ghostStepCounter,
          respawnCooldownMs,
        } = prev;

        // stop total en win / game over
        if (hasWon || isGameOver) {
          return prev;
        }

        // cooldown après perte de vie : freeze complet
        if (respawnCooldownMs > 0) {
          const remaining = Math.max(0, respawnCooldownMs - STEP_MS);
          return {
            ...prev,
            respawnCooldownMs: remaining,
          };
        }

        const movePacmanOnce = (
          dir: Direction,
          pos: Position,
          gridIn: string[],
          scoreIn: number,
          dotsIn: number
        ) => {
          if (!dir) {
            return {
              moved: false,
              pos,
              grid: gridIn,
              score: scoreIn,
              dots: dotsIn,
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

          if (!canMoveToInGrid(gridIn, nx, ny)) {
            return {
              moved: false,
              pos,
              grid: gridIn,
              score: scoreIn,
              dots: dotsIn,
            };
          }

          let newGrid = gridIn;
          let newScore = scoreIn;
          let newDots = dotsIn;

          const cell = gridIn[ny][nx];
          if (cell === ".") {
            newScore += 10;
            newDots -= 1;

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
            dots: newDots,
          };
        };

        // variables "next"
        let nextGrid = grid;
        let nextPacman = pacman;
        let nextDir = direction;
        let nextNextDir = nextDirection;
        let nextScore = score;
        let nextDots = remainingDots;
        let nextGhosts = ghosts;
        let nextLives = lives;
        let nextHasWon = hasWon;
        let nextIsGameOver = isGameOver;
        let nextGhostStepCounter = ghostStepCounter;
        let nextRespawn = respawnCooldownMs;

        // 1) Pacman : priorité à la direction demandée
        if (nextDirection) {
          const res = movePacmanOnce(
            nextDirection,
            nextPacman,
            nextGrid,
            nextScore,
            nextDots
          );
          if (res.moved) {
            nextDir = nextDirection;
            nextPacman = res.pos;
            nextGrid = res.grid;
            nextScore = res.score;
            nextDots = res.dots;
          }
        }

        // 2) sinon, on continue dans la direction actuelle
        if (!nextHasWon && !nextDirection && direction) {
          const res = movePacmanOnce(
            direction,
            nextPacman,
            nextGrid,
            nextScore,
            nextDots
          );
          if (res.moved) {
            nextPacman = res.pos;
            nextGrid = res.grid;
            nextScore = res.score;
            nextDots = res.dots;
          }
        }

        // 3) collision après déplacement de Pacman
        const hitAfterPacmanMove = nextGhosts.some(
          (g) =>
            g.position.x === nextPacman.x && g.position.y === nextPacman.y
        );
        if (hitAfterPacmanMove) {
          const livesAfter = nextLives - 1;
          const gameOverAfter = livesAfter <= 0;

          return {
            grid: nextGrid,
            pacman: findInitialPacman(),
            direction: null,
            nextDirection: null,
            score: nextScore,
            lives: livesAfter,
            remainingDots: nextDots,
            hasWon: false,
            ghosts: createInitialGhosts(),
            isGameOver: gameOverAfter,
            ghostStepCounter: 0,
            respawnCooldownMs: gameOverAfter ? 0 : 1500, // 1.5s de pause
          };
        }

        // 4) déplacement des fantômes (plus lents)
        nextGhostStepCounter += 1;
        if (nextGhostStepCounter >= GHOST_STEP_FACTOR) {
          nextGhosts = nextGhosts.map((g) => moveGhostRandomly(g, nextGrid));
          nextGhostStepCounter = 0;
        }

        // 5) collision après déplacement des fantômes
        const hitAfterGhostMove = nextGhosts.some(
          (g) =>
            g.position.x === nextPacman.x && g.position.y === nextPacman.y
        );
        if (hitAfterGhostMove) {
          const livesAfter = nextLives - 1;
          const gameOverAfter = livesAfter <= 0;

          return {
            grid: nextGrid,
            pacman: findInitialPacman(),
            direction: null,
            nextDirection: null,
            score: nextScore,
            lives: livesAfter,
            remainingDots: nextDots,
            hasWon: false,
            ghosts: createInitialGhosts(),
            isGameOver: gameOverAfter,
            ghostStepCounter: 0,
            respawnCooldownMs: gameOverAfter ? 0 : 1500,
          };
        }

        // 6) victoire si plus de pastilles
        const hasWonAfter = nextHasWon || nextDots <= 0;

        return {
          grid: nextGrid,
          pacman: nextPacman,
          direction: nextDir,
          nextDirection: nextNextDir,
          score: nextScore,
          lives: nextLives,
          remainingDots: nextDots,
          hasWon: hasWonAfter,
          ghosts: nextGhosts,
          isGameOver: nextIsGameOver || false, // jamais forcé à true ici
          ghostStepCounter: nextGhostStepCounter,
          respawnCooldownMs: nextRespawn,
        };
      });
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, []);

  const { grid, pacman, score, lives, hasWon, ghosts, isGameOver } = state;

  const handleNextLevel = () => {
    const newGrid = createInitialGrid();
    const newGhosts = createInitialGhosts();
    setState((prev) => ({
      ...prev,
      grid: newGrid,
      pacman: findInitialPacman(),
      direction: null,
      nextDirection: null,
      remainingDots: countDots(newGrid),
      hasWon: false,
      ghosts: newGhosts,
      isGameOver: false,
      ghostStepCounter: 0,
      respawnCooldownMs: 0,
    }));
  };

  const handleRestart = () => {
    const newGrid = createInitialGrid();
    const newGhosts = createInitialGhosts();
    setState({
      grid: newGrid,
      pacman: findInitialPacman(),
      direction: null,
      nextDirection: null,
      score: 0,
      lives: 3,
      remainingDots: countDots(newGrid),
      hasWon: false,
      ghosts: newGhosts,
      isGameOver: false,
      ghostStepCounter: 0,
      respawnCooldownMs: 0,
    });
  };

  return (
    <div className="screen center">
      <h1 className="game-title">PACMAN RETRO</h1>

      <div className="game-hud">
        <span>SCORE : {score}</span>
        <span className="game-lives">VIES : {"❤".repeat(lives)}</span>
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

        {/* Pacman */}
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

        {/* Fantômes */}
        {ghosts.map((g) => (
          <div
            key={g.id}
            className="ghost"
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              transform: `translate(${g.position.x * TILE_SIZE}px, ${
                g.position.y * TILE_SIZE
              }px)`,
              backgroundColor: g.color,
            }}
          />
        ))}

        {/* Overlay WIN */}
        {hasWon && !isGameOver && (
          <div className="overlay">
            <div className="overlay-box">
              <h2>YOU WIN!</h2>
              <p>Niveau complété</p>
              <button onClick={handleNextLevel}>Next level</button>
              <button onClick={onBackToMenu}>Retour au menu</button>
            </div>
          </div>
        )}

        {/* Overlay GAME OVER */}
        {isGameOver && (
          <div className="overlay">
            <div className="overlay-box">
              <h2>GAME OVER</h2>
              <p>Score : {score}</p>
              <button onClick={handleRestart}>Restart</button>
              <button onClick={onBackToMenu}>Retour au menu</button>
            </div>
          </div>
        )}
      </div>

      <button onClick={onBackToMenu}>Retour au menu</button>
    </div>
  );
}
