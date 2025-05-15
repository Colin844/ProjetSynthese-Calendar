import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Form.css";

const RegisterForm = () => {
  // États pour les champs du formulaire
  const [prenom, setPrenom] = useState("");
  const [nomFamille, setNomFamille] = useState("");
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  // État pour afficher un message d'erreur si besoin
  const [erreur, setErreur] = useState("");

  // Traduction i18next
  const { t } = useTranslation();

  // Pour rediriger vers la page de connexion après inscription
  const navigate = useNavigate();

  // Fonction déclenchée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement par défaut du formulaire
    setErreur(""); // Réinitialiser les erreurs

    // Vérifie que tous les champs obligatoires sont remplis
    if (!prenom || !nomFamille || !courriel || !motDePasse) {
      setErreur(t("register.error_required"));
      return;
    }

    // Fusionne prénom et nom pour obtenir le nom complet
    const nom = `${prenom.trim()} ${nomFamille.trim()}`;

    try {
      // Requête POST vers l'API pour créer un nouvel utilisateur
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/inscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, courriel, motDePasse }),
      });

      const data = await response.json();

      // Gérer les erreurs retournées par le backend
      if (!response.ok) {
        const message =
          data.erreurs?.[0]?.msg || data.message || t("register.error_generic");
        throw new Error(message);
      }

      // Si l'inscription réussit, redirection vers la page de connexion
      navigate("/login");
    } catch (err) {
      setErreur(err.message); // Affichage du message d’erreur
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {/* Titre du formulaire */}
      <h2>{t("register.title")}</h2>

      {/* Champ : prénom */}
      <label htmlFor="prenom">{t("register.first_name")}</label>
      <input
        id="prenom"
        type="text"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        required
      />

      {/* Champ : nom de famille */}
      <label htmlFor="nomFamille">{t("register.last_name")}</label>
      <input
        id="nomFamille"
        type="text"
        value={nomFamille}
        onChange={(e) => setNomFamille(e.target.value)}
        required
      />

      {/* Champ : courriel */}
      <label htmlFor="courriel">{t("register.email")}</label>
      <input
        id="courriel"
        type="email"
        value={courriel}
        onChange={(e) => setCourriel(e.target.value)}
        required
      />

      {/* Champ : mot de passe */}
      <label htmlFor="motDePasse">{t("register.password")}</label>
      <input
        id="motDePasse"
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        required
      />

      {/* Affichage du message d'erreur si présent */}
      {erreur && <p className="error">{erreur}</p>}

      {/* Bouton de soumission */}
      <button type="submit" className="button">
        {t("register.submit")}
      </button>

      {/* Lien vers la page de connexion si l’utilisateur a déjà un compte */}
      <p className="redirect-login">
        {t("register.login_redirect")}{" "}
        <Link to="/login">{t("login.title")}</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
