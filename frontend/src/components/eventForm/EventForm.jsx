import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";

const EventForm = ({ eventInitial = null }) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [erreur, setErreur] = useState("");
  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  // Préremplir les champs si on est en mode édition
  useEffect(() => {
    if (eventInitial) {
      setEventName(eventInitial.eventName || "");
      setEventDescription(eventInitial.eventDescription || "");
      setEventDate(eventInitial.eventDate || "");
      setEventTime(eventInitial.eventTime || "");
    }
  }, [eventInitial]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!eventName || !eventDate) {
      setErreur("Veuillez remplir le titre et la date de l'événement.");
      return;
    }

    const payload = {
      titre: eventName,
      description: eventDescription,
      date: eventDate,
      heure: eventTime,
    };

    try {
      const response = await fetch(
        eventInitial
          ? `http://localhost:5000/api/evenements/${eventInitial.id}`
          : "http://localhost:5000/api/evenements",
        {
          method: eventInitial ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de sauvegarde");
      }

      navigate("/");
    } catch (err) {
      setErreur(err.message);
    }
  };

  // Vérifier si mode modifier événement ou ajouter événement
  // Si id de l'événement initial existe, on est en mode édition
  const modeEdition = !!eventInitial?.id;

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>{modeEdition ? "Modifier l'événement" : "Créer un événement"}</h2>

      <label htmlFor="eventName">Nom de l&apos;événement</label>
      <input
        id="eventName"
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        required
      />

      <label htmlFor="eventDescription">Description de l&apos;événement</label>
      <input
        id="eventDescription"
        type="text"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />

      <label htmlFor="eventDate">Date de l&apos;événement</label>
      <input
        id="eventDate"
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        required
      />

      <label htmlFor="eventTime">Heure de l&apos;événement</label>
      <input
        id="eventTime"
        type="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />

      {erreur && <p className="error">{erreur}</p>}

      <button type="submit" className="button">
        {modeEdition ? "Modifier l'événement" : "Créer l'événement"}
      </button>
    </form>
  );
};

EventForm.propTypes = {
  eventInitial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    eventName: PropTypes.string,
    eventDescription: PropTypes.string,
    eventDate: PropTypes.string,
    eventTime: PropTypes.string,
  }),
};

export default EventForm;
