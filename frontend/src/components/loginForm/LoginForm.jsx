import { useContext, useState } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Form.css";

const LoginForm = () => {
  // Récupération de la fonction login depuis le contexte d'authentification
  const { login } = useContext(AuthContext);

  // Hook pour la navigation après connexion
  const navigate = useNavigate();

  // Hook pour les traductions i18next
  const { t } = useTranslation();

  // Champs du formulaire
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  // Pour afficher un message d'erreur en cas de problème
  const [erreur, setErreur] = useState("");

  // Fonction déclenchée à la soumission du formulaire
  const authSubmitHandler = async (event) => {
    event.preventDefault(); // Empêche le rechargement par défaut

    try {
      // Appel API pour connecter l'utilisateur
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/connexion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courriel: email,
          motDePasse: motDePasse,
        }),
      });

      const data = await response.json();

      // Si réponse invalide, générer une erreur
      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      // Si connexion réussie : appel du contexte et redirection vers l'accueil
      login(data.token, data.userId, data.nom);
      navigate("/");
    } catch (err) {
      setErreur(err.message); // Afficher le message d'erreur
    }
  };

  return (
    <form onSubmit={authSubmitHandler} className="login-form">
      {/* Titre du formulaire (traduit) */}
      <h2>{t("login.title")}</h2>

      {/* Champ courriel */}
      <div>
        <label htmlFor="user">{t("login.email")}</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      {/* Champ mot de passe */}
      <div>
        <label htmlFor="password">{t("login.password")}</label>
        <input
          id="password"
          type="password"
          name="password"
          value={motDePasse}
          onChange={(event) => setMotDePasse(event.target.value)}
        />
      </div>

      {/* Affichage du message d'erreur si nécessaire */}
      {erreur && <p className="error">{erreur}</p>}

      {/* Bouton de connexion */}
      <button className="button" type="submit">
        {t("login.submit")}
      </button>

      {/* Lien vers la page d'inscription si l'utilisateur n'a pas de compte */}
      <p className="redirect-register">
        {t("login.no_account")}{" "}
        <Link to="/register">{t("login.register_here")}</Link>
      </p>
    </form>
  );
};

export default LoginForm;
