import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useTranslation } from "react-i18next";
import "./VueJour.css";
import Modal from "../modal/Modal";

const VueJour = () => {
  // Récupère la date depuis l'URL
  const { date } = useParams();

  // Accès au token depuis le contexte d’authentification
  const { token } = useContext(AuthContext);

  // Traduction i18next
  const { t } = useTranslation();

  // Hook de navigation
  const navigate = useNavigate();

  // État local pour stocker les événements du jour
  const [evenements, setEvenements] = useState([]);

  // État pour gérer l'ouverture de la boîte de confirmation
  const [modalOuvert, setModalOuvert] = useState(false);

  // Événement sélectionné pour suppression
  const [eventASupprimer, setEventASupprimer] = useState(null);

  // Formattage de la date pour l'affichage (ex: Lundi 6 Mai 2025)
  const jourDate = new Date(date);
  const nomJour = t(`day.days.${jourDate.getDay()}`);
  const nomMois = t(`day.months.${jourDate.getMonth()}`);
  const numero = jourDate.getDate();
  const annee = jourDate.getFullYear();
  const dateFormatee = `${nomJour} ${numero} ${nomMois} ${annee}`;

  // Charger les événements pour la date donnée
  useEffect(() => {
    const chargerEvenements = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}evenements/date/${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setEvenements(data.evenements); // Stocke les événements reçus
        }
      } catch (err) {
        console.error("Erreur chargement événements :", err);
      }
    };

    chargerEvenements();
  }, [date, token]);

  // Naviguer vers le jour précédent ou suivant
  const allerJour = (offset) => {
    const jour = new Date(date);
    jour.setDate(jour.getDate() + offset); // Ajoute ou retire des jours
    const suivant = jour.toISOString().split("T")[0]; // Format YYYY-MM-DD
    navigate(`/day/${suivant}`);
  };

  // Supprimer un événement
  const supprimerEvenement = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}evenements/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        // Supprimer l'événement de l'état local
        setEvenements((prev) => prev.filter((ev) => ev.id !== id));
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <div className="day-view">
      {/* Navigation entre les jours */}
      <div className="date-navigation">
        <button onClick={() => allerJour(-1)}>{t("day.previous")}</button>
        <h2>{dateFormatee}</h2>
        <button onClick={() => allerJour(1)}>{t("day.next")}</button>
      </div>

      {/* Bouton pour créer un nouvel événement */}
      <div className="action-buttons">
        <button onClick={() => navigate("/addEvent")}>
          {t("event.create")}
        </button>
      </div>

      {/* Liste des événements de la journée */}
      <ul className="liste-evenements">
        {evenements.length === 0 ? (
          <li>{t("event.none")}</li> // Message si aucun événement
        ) : (
          evenements.map((ev) => (
            <li key={ev.id} className="evenement">
              <div className="event-header">
                <strong>{ev.titre}</strong>
                <span> • {ev.heure || "—"}</span>
              </div>
              <div className="event-lieu">{ev.lieu}</div>
              <div className="event-actions">
                {/* Bouton modifier */}
                <button onClick={() => navigate(`/editEvent/${ev.id}`)}>
                  {t("event.edit")}
                </button>

                {/* Bouton supprimer avec confirmation via modal */}
                <button
                  onClick={() => {
                    setEventASupprimer(ev); // Sauvegarde de l'événement
                    setModalOuvert(true);   // Ouvre le modal
                  }}
                >
                  {t("event.delete") || "Delete"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Modal de confirmation pour la suppression */}
      <Modal
        isOpen={modalOuvert}
        message={`Voulez-vous vraiment supprimer "${eventASupprimer?.titre}" ?`}
        onConfirm={() => {
          supprimerEvenement(eventASupprimer.id); // Supprimer après confirmation
          setModalOuvert(false);
          setEventASupprimer(null);
        }}
        onCancel={() => {
          setModalOuvert(false);       // Fermer le modal
          setEventASupprimer(null);    // Réinitialiser l’état
        }}
      />
    </div>
  );
};

export default VueJour;
