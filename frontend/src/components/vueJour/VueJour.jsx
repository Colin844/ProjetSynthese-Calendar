import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useTranslation } from "react-i18next";
import "./VueJour.css";

const VueJour = () => {
  const { date } = useParams();
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [evenements, setEvenements] = useState([]);

  const jourDate = new Date(date);
  const nomJour = t(`day.days.${jourDate.getDay()}`);
  const nomMois = t(`day.months.${jourDate.getMonth()}`);
  const numero = jourDate.getDate();
  const annee = jourDate.getFullYear();
  const dateFormatee = `${nomJour} ${numero} ${nomMois} ${annee}`;

  useEffect(() => {
    const chargerEvenements = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/evenements/date/${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setEvenements(data.evenements);
        }
      } catch (err) {
        console.error("Erreur chargement événements :", err);
      }
    };

    chargerEvenements();
  }, [date, token]);

  const allerJour = (offset) => {
    const jour = new Date(date);
    jour.setDate(jour.getDate() + offset);
    const suivant = jour.toISOString().split("T")[0];
    navigate(`/day/${suivant}`);
  };

  const supprimerEvenement = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/evenements/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setEvenements((prev) => prev.filter((ev) => ev.id !== id));
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <div className="day-view">
      <div className="date-navigation">
        <button onClick={() => allerJour(-1)}>{t("day.previous")}</button>
        <h2>{dateFormatee}</h2>
        <button onClick={() => allerJour(1)}>{t("day.next")}</button>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate("/addEvent")}>
          {t("event.create")}
        </button>
      </div>

      <ul className="liste-evenements">
        {evenements.length === 0 ? (
          <li>{t("event.none")}</li>
        ) : (
          evenements.map((ev) => (
            <li key={ev.id} className="evenement">
              <div className="event-header">
                <strong>{ev.titre}</strong>
                <span>({ev.heure || "—"})</span>
              </div>
              <div className="event-actions">
                <button onClick={() => navigate(`/editEvent/${ev.id}`)}>
                  {t("event.edit")}
                </button>
                <button onClick={() => supprimerEvenement(ev.id)}>
                  {t("event.delete") || "Delete"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default VueJour;
