import "./Calendar.css";
import { useEffect, useState, useContext } from "react";
import EventList from "../eventList/EventList";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";

function Calendar() {
  // Initialise mois et année avec la date d'aujourd'hui
  const today = new Date();
  const [mois, setMois] = useState(today.getMonth());
  const [annee, setAnnee] = useState(today.getFullYear());
  const [evenements, setEvenements] = useState([]);
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const joursSemaine = t("calendar.days", { returnObjects: true });

  // Retourne le nombre total de jours dans un mois donné
  const getJoursDansMois = (mois, annee) => {
    // en fixant le jour à 0, on obtient le dernier jour du mois précédent (mois+1)
    return new Date(annee, mois + 1, 0).getDate();
  };

  // Indice (0-6) du premier jour du mois (0 = Dimanche)
  const premierJourDuMois = new Date(annee, mois, 1).getDay();
  const joursDuMois = getJoursDansMois(mois, annee);

  // Charger les événements dans le calendrier
  // On utilise useEffect pour charger les événements à chaque fois que le mois ou l'année change
  useEffect(() => {
    const chargerEvenements = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/evenements", {
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

  const getEvenementsPourJour = (jour) => {
    const dateStr = new Date(annee, mois, jour).toISOString().split("T")[0];
    return evenements.filter((e) => e.date === dateStr);
  };

  const jours = [];
  for (let i = 0; i < premierJourDuMois; i++) {
    jours.push(<div key={`vide-${i}`} className="jour vide" />);
  }

  // Puis les jours numérotés
  for (let i = 1; i <= joursDuMois; i++) {
    const eventsDuJour = getEvenementsPourJour(i);
    const eventsToShow = eventsDuJour.slice(0, 3);
    const moreCount = eventsDuJour.length - eventsToShow.length;

    jours.push(
      <div key={i} className="jour">
        <span className="numero-jour">{i}</span>
        {eventsToShow.map((ev) => (
          <div
            key={ev.id}
            className="event"
            onClick={() => navigate(`/editEvent/${ev.id}`)}
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

  // Gère le changement de mois et l'éventuel passage d'année
  const changerMois = (offset) => {
    let nouveauMois = mois + offset;
    let nouvelleAnnee = annee;
    if (nouveauMois > 11) {
      // Si on dépasse Décembre, on revient à Janvier de l'année suivante
      nouveauMois = 0;
      nouvelleAnnee++;
    } else if (nouveauMois < 0) {
      // Si on passe avant Janvier, on revient à Décembre de l'année précédente
      nouveauMois = 11;
      nouvelleAnnee--;
    }
    setMois(nouveauMois);
    setAnnee(nouvelleAnnee);
  };

  return (
    <div className="calendrier-wrapper">
      <div className="calendrier">
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

        <div className="semaines">
          {joursSemaine.map((j, index) => (
            <div key={index} className="jour semaine">
              {j}
            </div>
          ))}

          {jours}
        </div>
      </div>

      {/* Section des événements à venir */}
      <EventList />
    </div>
  );
}

export default Calendar;

// SOURCE D'AIDE CRÉATION DE CE CALENDRIER (OPEN SOURCE) : https://derrickotte.medium.com/how-to-create-a-calendar-from-scratch-in-react-1f2db197454d
// : https://www.youtube.com/watch?v=wDayVPGWipI
// : https://www.youtube.com/watch?v=RWz23UKXdAk
