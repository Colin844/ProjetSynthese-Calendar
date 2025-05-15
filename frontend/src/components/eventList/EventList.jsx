import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  // État pour stocker les événements à venir
  const [evenements, setEvenements] = useState([]);

  // Récupère les informations d'authentification
  const { token, isLoggedIn } = useContext(AuthContext);

  // Hook pour les traductions
  const { t } = useTranslation();

  // Pour rediriger l'utilisateur vers la page  de modification
  const navigate = useNavigate();

  // Chargement des événements à chaque fois que le token change
  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, on vide la liste
    if (!isLoggedIn) {
      setEvenements([]);
      return;
    }

    // Fonction asynchrone pour récupérer les événements 
    const chargerEvenements = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}evenements`, {
          headers: {
            Authorization: `Bearer ${token}`, // envoie le token d'authentification
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Filtrer uniquement les événements à venir (date >= aujourd'hui)
          const aujourdHui = new Date().toISOString().split("T")[0];
          const aVenir = data.evenements.filter((e) => e.date >= aujourdHui);
          setEvenements(aVenir);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des événements", err);
      }
    };

    chargerEvenements();
  }, [token]);

  // Fonction pour rediriger vers le formulaire d’édition de l’événement
  const modifierEvent = (id) => {
    navigate(`/editEvent/${id}`);
  };

  return (
    // Section latérale pour afficher les événements à venir
    <aside className="evenements-avenir">
      <h3>{t("event.upcoming")}</h3>

      <ul>
        {/* Si aucun événement, afficher un message */}
        {evenements.length === 0 ? (
          <li>{t("event.none")}</li>
        ) : (
          // Sinon, lister les événements
          evenements.map((ev) => (
            <li
              key={ev.id}
              onClick={() => modifierEvent(ev.id)} // Clique pour modifier l’événement
              className="event-item"
              style={{ cursor: "pointer" }} // Curseur pointeur pour indiquer l’interaction
            >
              <strong>{ev.titre}</strong> — {ev.date}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default EventList;
