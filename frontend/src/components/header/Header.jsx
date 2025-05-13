import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import "./Header.css";

const Header = () => {
  const { isLoggedIn, logout, nom } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    // Déconnecter l'utilisateur et rediriger vers la page d'accueil
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__left">
        {isLoggedIn && <span className="user-name">{nom}</span>}
        <h1>{t("header.calendar")}</h1>
      </div>

      <nav className="header__nav">
        <Link to="/">{t("header.accueil")}</Link>

        {isLoggedIn && <Link to="/addEvent">{t("header.add_event")}</Link>}

        {!isLoggedIn && <Link to="/login">{t("header.login")}</Link>}

        {isLoggedIn && (
          <button className="nav-button" onClick={handleLogout}>
            {t("header.logout")}
          </button>
        )}
        {/* Composant de changement de langue */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;
