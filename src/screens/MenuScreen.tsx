type MenuScreenProps = {
    onStart: () => void;
    onThemes: () => void;
    onDifficulty: () => void;
    onHallOfFame: () => void;
    onReleaseNotes: () => void;
    onCredits: () => void;
  };
  
  export default function MenuScreen(props: MenuScreenProps) {
    return (
      <div className="screen center menu-screen">
        <h1 className="menu-title">MENU PRINCIPAL</h1>
  
        <div className="menu-buttons">
          <button onClick={props.onStart}>Start Game</button>
          <button onClick={props.onThemes}>Thèmes</button>
          <button onClick={props.onDifficulty}>Difficulté</button>
          <button onClick={props.onHallOfFame}>Hall of Fame</button>
          <button onClick={props.onReleaseNotes}>Release Notes</button>
          <button onClick={props.onCredits}>Crédits</button>
        </div>
      </div>
    );
  }
  