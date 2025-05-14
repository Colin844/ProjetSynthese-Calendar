import { useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
    // Récupère le token depuis localStorage si présent 
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });
  // Initialise les valeurs depuis localStorage pour maintenir la session
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [nom, setNom] = useState(() => localStorage.getItem("nom"));

  const login = (token, userId, nom) => {
    setToken(token);
    setUserId(userId);
    setNom(nom);
    setIsLoggedIn(true);

        // Sauvegarde les données de session dans localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("nom", nom);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setNom(null);
    setIsLoggedIn(false);

    // Supprime les données de session du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("nom");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, userId, nom, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
