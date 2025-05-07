import "./Calendar.css";
import { useState } from "react";

const joursSemaine = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function Calendar() {
  // Initialise mois et année avec la date d'aujourd'hui
  const today = new Date();
  const [mois, setMois] = useState(today.getMonth());
  const [année, setAnnée] = useState(today.getFullYear());

  // Retourne le nombre total de jours dans un mois donné
  const getJoursDansMois = (mois, année) => {
    // en fixant le jour à 0, on obtient le dernier jour du mois précédent (mois+1)
    return new Date(année, mois + 1, 0).getDate();
  };

  // Indice (0-6) du premier jour du mois (0 = Dimanche)
  const premierJourDuMois = new Date(année, mois, 1).getDay();
  const joursDuMois = getJoursDansMois(mois, année);

  // Création des cases de calendrier - d'abord les vides pour le décalage
  const jours = [];
  for (let i = 0; i < premierJourDuMois; i++) {
    jours.push(<div key={`vide-${i}`} className="jour vide" />);
  }

  // Puis les jours numérotés
  for (let i = 1; i <= joursDuMois; i++) {
    jours.push(
      <div key={i} className="jour">
        {i}
      </div>
    );
  }

  // Gère le changement de mois et l'éventuel passage d'année
  const changerMois = (offset) => {
    let nouveauMois = mois + offset;
    let nouvelleAnnée = année;
    if (nouveauMois > 11) {
      // Si on dépasse Décembre, on revient à Janvier de l'année suivante
      nouveauMois = 0;
      nouvelleAnnée++;
    } else if (nouveauMois < 0) {
      // Si on passe avant Janvier, on revient à Décembre de l'année précédente
      nouveauMois = 11;
      nouvelleAnnée--;
    }
    setMois(nouveauMois);
    setAnnée(nouvelleAnnée);
  };

  return (
    <div className="calendrier">
      <div className="header">
        <button onClick={() => changerMois(-1)}>&lt;</button>
        <h2>
          {/* Affiche le mois et l'année en français */  }
          {new Date(année, mois).toLocaleString("fr-FR", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={() => changerMois(1)}>&gt;</button>
      </div>

      <div className="semaines">
        {joursSemaine.map((j) => (
          <div key={j} className="jour semaine">{j}</div>
        ))}
        {jours}
      </div>
    </div>
  );
}