import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";

const Header = () => {
  const { isLoggedIn, logout, nom } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Déconnecter l'utilisateur et rediriger vers la page d'accueil
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <h1>CAL3ND4R</h1>

      <nav className="header__nav">
        <Link to="/">Accueil</Link>

        {isLoggedIn && <Link to="/addEvent">Ajouter un événement</Link>}

        {!isLoggedIn && <Link to="/login">Connexion</Link>}

        {isLoggedIn && (
          <>
            <span>Bienvenue, {nom || "Utilisateur"}</span>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
