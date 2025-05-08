import { useContext, useState } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login } = useContext(AuthContext); // Récupérer contexte authentification
  const navigate = useNavigate(); // Récupérer fonction de navigation

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  const authSubmitHandler = (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page

    if (email === "test@test.com" && motDePasse === "1234") {
      // Utiliser valeurs de test
      const fakeToken = "FAUX_TOKEN";

      login(fakeToken, email); // Appeler fonction de connexion
      navigate("/"); // Rediriger vers la page d'accueil
    } else {
      setErreur("Identifiants invalides"); // Afficher erreur
    }
  };

  return (
    <form onSubmit={authSubmitHandler} className="login-form">
      <h2>Connexion</h2>

      <div>
        <label htmlFor="user">Adresse Courriel</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
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
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
