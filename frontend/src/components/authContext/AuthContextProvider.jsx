import { useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [nom, setNom] = useState(null);

  const login = (token, userId, nom) => {
    setToken(token);
    setUserId(userId);
    setNom(nom);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setNom(null);
    setIsLoggedIn(false);
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
