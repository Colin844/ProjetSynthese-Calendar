import "./Calendar.css";
import { useEffect, useState, useContext } from "react";
import EventList from "../eventList/EventList";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";

function Calendar() {
  // Obtenir la date du jour et initialiser l'état du mois et de l'année affichés
  const today = new Date();
  const [mois, setMois] = useState(today.getMonth());
  const [annee, setAnnee] = useState(today.getFullYear());

  // Liste des événements du mois affiché
  const [evenements, setEvenements] = useState([]);

  // Traduction i18next
  const { t } = useTranslation();

  // Authentification pour l'appel API
  const { token } = useContext(AuthContext);

  // Pour naviguer entre les pages 
  const navigate = useNavigate();

  // Traduction des jours de la semaine 
  const joursSemaine = t("calendar.days", { returnObjects: true });

  // Obtenir le nombre de jours dans un mois donné
  const getJoursDansMois = (mois, annee) => {
    return new Date(annee, mois + 1, 0).getDate();
  };

  // Obtenir l'indice du premier jour du mois (0 = Dimanche)
  const premierJourDuMois = new Date(annee, mois, 1).getDay();
  const joursDuMois = getJoursDansMois(mois, annee);

  // Charger les événements quand le mois ou l'année change
  useEffect(() => {
    const chargerEvenements = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}evenements`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setEvenements(data.evenements);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des événements", err);
      }
    };

    chargerEvenements();
  }, [token, mois, annee]);

  // Obtenir les événements pour une journée donnée
  const getEvenementsPourJour = (jour) => {
    const dateStr = new Date(annee, mois, jour).toISOString().split("T")[0];
    const aujourdHui = new Date().toISOString().split("T")[0];

    return evenements.filter((e) => e.date === dateStr && e.date >= aujourdHui);
  };

  const jours = [];

  // Remplir les cases vides avant le premier jour du mois
  for (let i = 0; i < premierJourDuMois; i++) {
    jours.push(<div key={`vide-${i}`} className="jour vide" />);
  }

  // Déterminer la classe CSS selon la priorité de l'événement
  const getPriorityClass = (priorite) => {
    switch (priorite?.toLowerCase()) {
      case "critique":
        return "event-priorite-critique";
      case "elevee":
        return "event-priorite-haute";
      case "normale":
        return "event-priorite-moyenne";
      case "basse":
        return "event-priorite-basse";
      default:
        return "";
    }
  };

  // Afficher chaque jour du mois avec les événements associés
  for (let i = 1; i <= joursDuMois; i++) {
    const eventsDuJour = getEvenementsPourJour(i);
    const eventsToShow = eventsDuJour.slice(0, 3); // Affiche max 3 événements
    const moreCount = eventsDuJour.length - eventsToShow.length;
  // Création chaîne de caractères au format YYYY-MM-DD
    const jourString = `${annee}-${String(mois + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    jours.push(
      <div
        key={i}
        onClick={() => navigate(`/day/${jourString}`)}
        className="jour"
      >
        <span className="numero-jour">{i}</span>
        {eventsToShow.map((ev) => (
          <div
            key={ev.id}
            className={`event ${getPriorityClass(ev.priorite)}`}
            onClick={(e) => {
              e.stopPropagation(); // Évite la redirection vers /day/ quand on clique sur l'événement
              navigate(`/editEvent/${ev.id}`);
            }}
          >
            {ev.titre}
          </div>
        ))}
        {moreCount > 0 && (
          <div className="more-events">
            +{moreCount} {t("event.more")}
          </div>
        )}
      </div>
    );
  }

  // Changer de mois (offset : +1 = mois suivant, -1 = mois précédent)
  const changerMois = (offset) => {
    let nouveauMois = mois + offset;
    let nouvelleAnnee = annee;
    if (nouveauMois > 11) {
      nouveauMois = 0;
      nouvelleAnnee++;
    } else if (nouveauMois < 0) {
      nouveauMois = 11;
      nouvelleAnnee--;
    }

    setMois(nouveauMois);
    setAnnee(nouvelleAnnee);
  };

  return (
    <div className="calendrier-wrapper">
      <div className="calendrier">
        {/* En-tête avec navigation entre les mois */}
        <div className="header">
          <button onClick={() => changerMois(-1)}>&lt;</button>
          <h2>
             {/* Affiche le mois et l'année en français */}
            {new Date(annee, mois).toLocaleString(t("calendar.locale"), {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={() => changerMois(1)}>&gt;</button>
        </div>

        {/* Jours de la semaine */}
        <div className="semaines">
          {joursSemaine.map((j, index) => (
            <div key={index} className="jour semaine">
              {j}
            </div>
          ))}

          {/* Affichage des jours avec événements */}
          {jours}
        </div>
      </div>

      {/* Liste des événements à venir (droite) */}
      <EventList />
    </div>
  );
}

export default Calendar;

// SOURCE D'AIDE CRÉATION DE CE CALENDRIER (OPEN SOURCE) : https://derrickotte.medium.com/how-to-create-a-calendar-from-scratch-in-react-1f2db197454d
// : https://www.youtube.com/watch?v=wDayVPGWipI
// : https://www.youtube.com/watch?v=RWz23UKXdAk
