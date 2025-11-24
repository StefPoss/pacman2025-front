type GameScreenProps = {
    onBackToMenu: () => void;
  };
  
  export default function GameScreen({ onBackToMenu }: GameScreenProps) {
    return (
      <div className="screen center game-screen">
        <h1 className="game-title">PACMAN RETRO</h1>
  
        <div className="game-area-placeholder">
          {/* Ici on mettra plus tard le vrai moteur de jeu (canvas / p5 / etc.) */}
          <p>Zone de jeu (à venir)</p>
        </div>
  
        <button onClick={onBackToMenu}>Retour au menu</button>
      </div>
    );
  }
  