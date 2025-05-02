import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext/authContext";

const LoginForm = () => {
  const auth = useContext(AuthContext); // Récupérer contexte authentification

  const { formData, setFormData } = useState({
    user: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target; // Récupérer nom et valeurélément cible
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Mise à jour état du formulaire
  };

  const authSubmitHandler = (event) => {};

  return (
    <form onSubmit={authSubmitHandler}>
      <h2>Connexion</h2>

      <div>
        <label htmlFor="user">Nom d&apos;utilisateur</label>
        <input
          id="user"
          type="text"
          name="nom_user"
          value={formData.nom_user}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <p>
        <button className="button" type="submit">
          Se connecter
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
