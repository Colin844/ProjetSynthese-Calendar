import { useContext, useState } from "react";
import { AuthContext } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login } = useContext(AuthContext); // Récupérer contexte authentification
  const navigate = useNavigate(); // Récupérer fonction de navigation

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
