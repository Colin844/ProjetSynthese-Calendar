import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Form.css";

const RegisterForm = () => {
  const [prenom, setPrenom] = useState("");
  const [nomFamille, setNomFamille] = useState("");
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");

    if (!prenom || !nomFamille || !courriel || !motDePasse) {
      setErreur(t("register.error_required"));
      return;
    }

    const nom = `${prenom.trim()} ${nomFamille.trim()}`;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/inscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nom, courriel, motDePasse }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.erreurs?.[0]?.msg || data.message || t("register.error_generic");
        throw new Error(message);
      }

      navigate("/login");
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>{t("register.title")}</h2>

      <label htmlFor="prenom">{t("register.first_name")}</label>
      <input
        id="prenom"
        type="text"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        required
      />

      <label htmlFor="nomFamille">{t("register.last_name")}</label>
      <input
        id="nomFamille"
        type="text"
        value={nomFamille}
        onChange={(e) => setNomFamille(e.target.value)}
        required
      />

      <label htmlFor="courriel">{t("register.email")}</label>
      <input
        id="courriel"
        type="email"
        value={courriel}
        onChange={(e) => setCourriel(e.target.value)}
        required
      />

      <label htmlFor="motDePasse">{t("register.password")}</label>
      <input
        id="motDePasse"
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        required
      />

      {erreur && <p className="error">{erreur}</p>}

      <button type="submit" className="button">
        {t("register.submit")}
      </button>

      <p className="redirect-login">
        {t("register.login_redirect")}{" "}
        <Link to="/login">{t("login.title")}</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
