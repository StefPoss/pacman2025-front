import { APP_NAME, APP_VERSION } from "../version";

type ReleaseNotesScreenProps = {
  onBack: () => void;
};

export default function ReleaseNotesScreen({ onBack }: ReleaseNotesScreenProps) {
  return (
    <div className="screen center">
      <h1>{APP_NAME} – Release notes</h1>
      <p>Version actuelle : {APP_VERSION}</p>

      <h2>v0.5.0 – Gameplay : déplacement fluide + pastilles + score</h2>
        <ul>
          <li>Ajout du moteur de déplacement <strong>case par case</strong></li>
          <li>Vitesse de déplacement constante (STEP_MS)</li>
          <li>Système de direction + prochaine direction (virages parfaits)</li>
          <li>Correction : Pac‑Man ne glisse plus, ne s’emballe plus après répétition clavier</li>
          <li>Ajout de la <strong>grille dynamique</strong> dérivée du niveau (LEVEL_1 → grid modifiable)</li>
          <li>Implémentation des <strong>pastilles</strong> (mangeables, disparition)</li>
          <li>Ajout du <strong>score</strong></li>
          <li>Correction du comportement : <strong>arrêt propre</strong> quand on relâche la direction actuelle</li>
          <li>Global : maniabilité validée par l’équipe (🎉)</li>
        </ul>      

      <h2>v0.4.0 – Déplacement de Pacman</h2>
        <ul>
          <li>Ajout d'un premier moteur de déplacement pour Pacman</li>
          <li>Contrôles clavier via les flèches (↑ ↓ ← →)</li>
          <li>Pacman se déplace dans la zone de jeu avec limites (pas de sortie d'écran)</li>
          <li>Préparation de la zone de jeu pour le futur labyrinthe et les fantômes</li>
        </ul>

      <h2>v0.3.0 – Écran de jeu (squelette)</h2>
        <ul>
          <li>Ajout de l'écran <strong>Start Game</strong> (GameScreen)</li>
          <li>Zone de jeu placeholder prête à accueillir le moteur de Pacman</li>
          <li>Bouton "Retour au menu" depuis l'écran de jeu</li>
        </ul>      

      <h2>v0.2.0 – Menu principal complet</h2>
        <ul>
          <li>Création du Menu principal avec 6 sections :</li>
          <ul>
            <li>Start Game</li>
            <li>Thèmes</li>
            <li>Difficulté</li>
            <li>Hall of Fame</li>
            <li>Release Notes</li>
            <li>Crédits</li>
          </ul>
          <li>Styles arcade rétro pour le menu</li>
          <li>Transition Splash → Menu</li>
          <li>Mise à jour du routage interne</li>
        </ul>      

      <section style={{ maxWidth: 700, textAlign: "left", marginTop: "2rem" }}>
        <h2>v0.1.0 – Initial public splash</h2>
        <ul>
          <li>Création du projet React + Vite</li>
          <li>Écran de splash PACMAN RETRO</li>
          <li>Déploiement GitHub Pages</li>
        </ul>

        {/* Plus tard tu ajouteras ici v0.2.0, v0.3.0, etc. */}
      </section>

      <button onClick={onBack} style={{ marginTop: "2rem" }}>
        Retour au menu
      </button>
    </div>
  );
}
