import { APP_NAME, APP_VERSION } from "../version";

type ReleaseNotesScreenProps = {
  onBack: () => void;
};


export default function ReleaseNotesScreen({ onBack }: ReleaseNotesScreenProps) {
  return (
    <div className="screen release-notes-screen">
      <section className="release-notes">
        <h1>
          {APP_NAME} – Release notes
        </h1>
        <p>Version actuelle : {APP_VERSION}</p>

        <h2>v0.8.3 – Release Notes Ghostify</h2>
          <ul>
            <li>
              Augmentation de la population de fantômes <strong>Release Notes</strong> :
              <ul>
                <li>ajout de fantômes sur tous les niveaux,</li>
                <li>déblocage du fantôme bloqué en level 1 ,</li>
                <li>correction des layouts pour éviter les zones inaccessibles.</li>
              </ul>
            </li>
          </ul>

        <h2>v0.8.2 – Release Notes Screen polish</h2>
          <ul>
            <li>
              Nouveau layout pour l’écran <strong>Release Notes</strong> :
              <ul>
                <li>contenu aligné à gauche pour une meilleure lisibilité,</li>
                <li>bloc central encadré avec padding et ombre portée,</li>
                <li>scroll vertical automatique si le changelog est long,</li>
                <li>suppression des styles inline inutiles.</li>
              </ul>
            </li>
            <li>
              Ajout de styles dédiés :
              <code>.release-notes-screen</code> et <code>.release-notes</code> stables.
            </li>
            <li>
              Correction du bouton <strong>Retour au menu</strong> :
              <ul>
                <li>suppression du faux appel <code>setScreen()</code> dans le composant,</li>
                <li>utilisation correcte de la prop <code>onBack</code> passée par le parent.</li>
              </ul>
            </li>
            <li>
              Refonte du markup du composant (suppression du
              <code>&lt;div class="screen center"&gt;</code> parasite).
            </li>
            <li>
              Harmonisation du style des titres et des listes sur l’écran Release Notes.
            </li>
          </ul>


        <h2>v0.8.1</h2>
        <ul>
          <li>
            <strong>5 niveaux jouables et finissables</strong> : correction des
            layouts (plus de zones inaccessibles).
          </li>
          <li>
            Ajout d&apos;un <strong>cheat code développeur</strong> : touches{" "}
            <code>1</code> à <code>5</code> pour charger directement le niveau
            correspondant.
          </li>
          <li>
            Mise en place d&apos;une vraie{" "}
            <strong>gestion des sons</strong> :
            <ul>
              <li>
                <code>move</code> → à chaque déplacement,
              </li>
              <li>
                <code>eat</code> → uniquement sur les grosses pastilles (power),
              </li>
              <li>
                <code>power</code>, <code>ghost</code>, <code>death</code> pour
                les événements clés.
              </li>
            </ul>
          </li>
          <li>
            Ajout de <strong>musiques de fond par niveau</strong>, en boucle.
          </li>
          <li>
            Amélioration du <strong>mode frightened</strong> : durée
            configurée, timer, clignotement visuel sur la fin.
          </li>
          <li>
            Un peu de <strong>nettoyage de code</strong> autour de{" "}
            <code>GameScreen.tsx</code> et des niveaux (suppression de modules
            inutilisés).
          </li>
        </ul>

        <h2>v0.8.0</h2>
        <ul>
          <li>
            Ajout du passage au <strong>niveau suivant</strong> après la
            victoire (multi-niveaux enchaînés).
          </li>
          <li>
            Introduction des <strong>super pastilles</strong> (
            <code>O</code>) qui déclenchent le mode power/fantômes vulnérables.
          </li>
          <li>
            Ajout des premiers <strong>effets sonores</strong> (déplacement /
            power / mort), base du sound design.
          </li>
        </ul>

        <h2>v0.7.0 – Ajout des fantômes &amp; mécanique de vies</h2>
        <ul>
          <li>Ajout de 4 fantômes : Blinky, Pinky, Inky et Clyde.</li>
          <li>IA simple : déplacement aléatoire avec évitement du demi‑tour.</li>
          <li>
            Vitesse des fantômes ajustée pour être fluide mais lisible
            (glissement 0.4s).
          </li>
          <li>Détection de collision Pacman ↔ fantôme.</li>
          <li>Système de vies : Pacman commence avec 3 vies.</li>
          <li>Perte d’une vie → reset positions Pacman + fantômes.</li>
          <li>
            Ajout d’un temps de pause (respawn) pour rendre la mort plus
            lisible.
          </li>
          <li>GAME OVER lorsque toutes les vies sont perdues.</li>
        </ul>

        <h2>v0.6.0 – Boucle de jeu niveau 1</h2>
        <ul>
          <li>
            Ajout d&apos;un système de <strong>vies</strong> (affichage des ❤,
            3 au départ).
          </li>
          <li>Comptage des pastilles restantes sur le niveau.</li>
          <li>
            Détection de la victoire quand toutes les pastilles sont mangées.
          </li>
          <li>
            Overlay <strong>&quot;YOU WIN!&quot;</strong> avec boutons{" "}
            <em>Next level</em> et retour au menu.
          </li>
          <li>
            Reset propre du niveau quand on clique sur <em>Next level</em>.
          </li>
        </ul>

        <h2>v0.5.0 – Gameplay : déplacement fluide + pastilles + score</h2>
        <ul>
          <li>
            Ajout du moteur de déplacement <strong>case par case</strong>.
          </li>
          <li>Vitesse de déplacement constante (STEP_MS).</li>
          <li>
            Système de direction + prochaine direction (virages parfaits).
          </li>
          <li>
            Correction : Pac‑Man ne glisse plus, ne s’emballe plus après
            répétition clavier.
          </li>
          <li>
            Ajout de la <strong>grille dynamique</strong> dérivée du niveau (
            <code>LEVEL_1</code> → grid modifiable).
          </li>
          <li>
            Implémentation des <strong>pastilles</strong> (mangeables,
            disparition).
          </li>
          <li>Ajout du <strong>score</strong>.</li>
          <li>
            Correction du comportement : <strong>arrêt propre</strong> quand on
            relâche la direction actuelle.
          </li>
          <li>
            Global : maniabilité validée par l’équipe{" "}
            <span role="img" aria-label="party">
              🎉
            </span>
          </li>
        </ul>

        <h2>v0.4.0 – Déplacement de Pacman</h2>
        <ul>
          <li>Ajout d&apos;un premier moteur de déplacement pour Pacman.</li>
          <li>Contrôles clavier via les flèches (↑ ↓ ← →).</li>
          <li>
            Pacman se déplace dans la zone de jeu avec limites (pas de sortie
            d&apos;écran).
          </li>
          <li>
            Préparation de la zone de jeu pour le futur labyrinthe et les
            fantômes.
          </li>
        </ul>

        <h2>v0.3.0 – Écran de jeu (squelette)</h2>
        <ul>
          <li>
            Ajout de l&apos;écran <strong>Start Game</strong> (GameScreen).
          </li>
          <li>
            Zone de jeu placeholder prête à accueillir le moteur de Pacman.
          </li>
          <li>Bouton &quot;Retour au menu&quot; depuis l&apos;écran de jeu.</li>
        </ul>

        <h2>v0.2.0 – Menu principal complet</h2>
        <ul>
          <li>Création du Menu principal avec 6 sections :</li>
          <li>
            <ul>
              <li>Start Game</li>
              <li>Thèmes</li>
              <li>Difficulté</li>
              <li>Hall of Fame</li>
              <li>Release Notes</li>
              <li>Crédits</li>
            </ul>
          </li>
          <li>Styles arcade rétro pour le menu.</li>
          <li>Transition Splash → Menu.</li>
          <li>Mise à jour du routage interne.</li>
        </ul>

        <h2>v0.1.0 – Initial public splash</h2>
        <ul>
          <li>Création du projet React + Vite.</li>
          <li>Écran de splash PACMAN RETRO.</li>
          <li>Déploiement GitHub Pages.</li>
        </ul>

        <div className="screen center">
        <button onClick={onBack}>
          Retour au menu
        </button>
        </div>
      </section>
    </div>
  );
}
