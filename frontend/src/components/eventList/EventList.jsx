import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../authContext/AuthContext";

const EventList = () => {
  const [evenements, setEvenements] = useState([]);
  const { token } = useContext(AuthContext);

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

  return (
    <aside className="evenements-avenir">
      <h3>À venir</h3>
      <ul>
        {evenements.length === 0 ? (
          <li>Aucun événement prévu.</li>
        ) : (
          evenements.map((ev) => (
            <li key={ev.id}>
              <strong>{ev.titre}</strong> — {ev.date}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default EventList;
