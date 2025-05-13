import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [evenements, setEvenements] = useState([]);
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {

    if (!isLoggedIn) {
      setEvenements([]);
      return;
    }

    const chargerEvenements = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/evenements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          // Ne garder que les événements à venir
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

  const modifierEvent = (id) => {
    navigate(`/editEvent/${id}`);
  };

  return (
    <aside className="evenements-avenir">
      <h3>{t("event.upcoming")}</h3>
      <ul>
        {evenements.length === 0 ? (
          <li>{t("event.none")}</li>
        ) : (
          evenements.map((ev) => (
            <li
              key={ev.id}
              onClick={() => modifierEvent(ev.id)}
              className="event-item"
              style={{ cursor: "pointer" }}
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
