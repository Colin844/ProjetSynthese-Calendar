import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";
import { useTranslation } from "react-i18next";
import Select from "react-select";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLieu, setEventLieu] = useState("");
  const [erreur, setErreur] = useState("");

  const { token } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams(); // récupère ID si existe

  const modeEdition = !!id;

  const optionsPriorite = [
    { value: "critique", label: t("priorite.critique") },
    { value: "elevee", label: t("priorite.elevee") },
    { value: "normale", label: t("priorite.normale") },
    { value: "basse", label: t("priorite.basse") },
  ];

  const [eventPriorite, setEventPriorite] = useState(optionsPriorite[2]);

  // Préremplir les champs si on est en mode édition
  useEffect(() => {
    const chargerEvenement = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}evenements/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setEventName(data.evenement.titre);
          setEventDescription(data.evenement.description || "");
          setEventDate(data.evenement.date);
          setEventTime(data.evenement.heure || "");
          setEventLieu(data.evenement.lieu || "");
        } else {
          throw new Error(data.message || t("event.error_load"));
        }
      } catch (err) {
        setErreur(err.message);
      }
    };

    if (modeEdition) {
      chargerEvenement();
    }
  }, [id, token, t, modeEdition]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!eventName || !eventDate) {
      setErreur(t("event.required_error"));
      return;
    }
    const aujourdHui = new Date().toISOString().split("T")[0];
    if (eventDate < aujourdHui) {
      setErreur(t("event.event_expired"));
      return;
    }

    const payload = {
      titre: eventName,
      description: eventDescription,
      date: eventDate,
      heure: eventTime,
      lieu: eventLieu,
      priorite: eventPriorite.value,
    };

    try {
      const response = await fetch(
        modeEdition
          ? `${import.meta.env.VITE_BACKEND_URL}evenements/${id}`
          : `${import.meta.env.VITE_BACKEND_URL}evenements`,
        {
          method: modeEdition ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur");
      }

      navigate("/");
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>{modeEdition ? t("event.edit") : t("event.create")}</h2>

      <label htmlFor="eventName">{t("event.name")}</label>
      <input
        id="eventName"
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        required
      />

      <label htmlFor="eventDescription">{t("event.description")}</label>
      <input
        id="eventDescription"
        type="text"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />

      <label htmlFor="eventDate">{t("event.date")}</label>
      <input
        id="eventDate"
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        required
      />

      <label htmlFor="eventTime">{t("event.time")}</label>
      <input
        id="eventTime"
        type="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />

      <label htmlFor="eventLieu">{t("event.place")}</label>
      <input
        id="eventLieu"
        type="text"
        value={eventLieu}
        onChange={(e) => setEventLieu(e.target.value)}
        required
      />

      <label htmlFor="eventPriorite">{t("event.priority")}</label>
      <Select
        className="select-priorite"
        id="eventPriorite"
        options={optionsPriorite}
        value={eventPriorite}
        onChange={setEventPriorite}
        placeholder={t("event.select_priority")}
        isSearchable
      />

      {erreur && <p className="error">{erreur}</p>}

      <button type="submit" className="button">
        {modeEdition ? t("event.edit") : t("event.create")}
      </button>
    </form>
  );
};

export default EventForm;
