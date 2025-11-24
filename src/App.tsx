import { useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import MenuScreen from "./screens/MenuScreen";
import ReleaseNotesScreen from "./screens/ReleaseNotesScreen";

type Screen =
  | "splash"
  | "menu"
  | "game"
  | "gameOver"
  | "hallOfFame"
  | "credits"
  | "releaseNotes"
  | "themes"
  | "difficulty";
 

function App() {
  const [screen, setScreen] = useState<Screen>("splash");

  const goToMenu = () => setScreen("menu");

  return (
    <div className="app-root">
      {screen === "splash" && <SplashScreen onContinue={goToMenu} />}

      {screen === "menu" && (
        <MenuScreen
          onStart={() => setScreen("game")}
          onThemes={() => setScreen("themes")}
          onDifficulty={() => setScreen("difficulty")}
          onHallOfFame={() => setScreen("hallOfFame")}
          onReleaseNotes={() => setScreen("releaseNotes")}
          onCredits={() => setScreen("credits")}
        />
      )}

      {screen === "themes" && (
        <div className="screen center">
          <h1>Thèmes (à venir)</h1>
          <button onClick={() => setScreen("menu")}>
            Retour au menu
          </button>
        </div>
      )}

      {screen === "difficulty" && (
        <div className="screen center">
          <h1>Difficulté (à venir)</h1>
          <button onClick={() => setScreen("menu")}>
            Retour au menu
          </button>          
        </div>
      )}

      {screen === "hallOfFame" && (
        <div className="screen center">
          <h1>Hall of Fame (à venir)</h1>
          <button onClick={() => setScreen("menu")}>
            Retour au menu
          </button>          
        </div>
      )}

      {screen === "releaseNotes" && (
        <ReleaseNotesScreen onBack={() => setScreen("menu")} />
      )}

      {screen === "credits" && (
        <div className="screen center">
          <h1>Crédits (à venir)</h1>
          <button onClick={() => setScreen("menu")}>
            Retour au menu
          </button>          
        </div>
        
      )}

      {/* Les autres écrans viendront plus tard */}
    </div>
  );
}

export default App;
