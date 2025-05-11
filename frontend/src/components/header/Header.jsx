import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import "./Header.css";

const Header = () => {
  const { isLoggedIn, logout, nom } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();  // Accès à la fonction de traduction

  const handleLogout = () => {
    // Déconnecter l'utilisateur et rediriger vers la page d'accueil
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <h1>CAL3ND4R</h1>

      <nav className="header__nav">
        <Link to="/">{t("header.accueil")}</Link>

        {isLoggedIn && <Link to="/addEvent">{t("header.add_event")}</Link>}

        {!isLoggedIn && <Link to="/login">{t("header.login")}</Link>}

        {isLoggedIn && (
          <>
            <span>{t("header.welcome")}, {nom || "Utilisateur"}</span>
            <button onClick={handleLogout}>{t("header.logout")}</button>
          </>
        )}
        {/* Composant de changement de langue */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;
