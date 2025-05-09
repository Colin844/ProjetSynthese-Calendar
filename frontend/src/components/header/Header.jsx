import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";

const Header = () => {
  const { isLoggedin, userId, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <h1>CAL3ND4R</h1>

      <nav className="header__nav">
        <Link to="/">Accueil</Link>
        {isLoggedin && <Link to="/dashboard">Tableau des événements</Link>}
        {!isLoggedin && <Link to="/login">Connexion</Link>}
        {!isLoggedin && <Link to="/addEvent">Ajouter un événement</Link>}
        {isLoggedin && (
          <>
            <span>Bienvenue, {userId}</span>
            <button onClick={logout}>Déconnexion</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
