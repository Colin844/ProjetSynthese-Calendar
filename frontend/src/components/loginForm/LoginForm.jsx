import { useContext, useState } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { login } = useContext(AuthContext); // Récupérer contexte authentification
  const navigate = useNavigate(); // Récupérer fonction de navigation
  const { t } = useTranslation(); // Accès à la fonction t() pour traduire les clés

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  const authSubmitHandler = async (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/connexion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courriel: email,
            motDePasse: motDePasse,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      login(data.token, data.userId, data.nom); // Appel de AuthContext
      navigate("/");
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <form onSubmit={authSubmitHandler} className="login-form">
      <h2>{t("login.title")}</h2>

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

      {erreur && <p className="error">{erreur}</p>}

      <button className="button" type="submit">
        {t("login.submit")}
      </button>
      <p className="redirect-register">
        {t("login.no_account")}{" "}
        <Link to="/register">{t("login.register_here")}</Link>
      </p>
    </form>
  );
};

export default LoginForm;
