import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false, // Si utilisateur connecté
  token: null, // Jeton authentification
  userId: null, // Identifiant utilisateur
  login: (token, userId) => {}, // Fonction se connecter
  logout: () => {}, // Fonction se déconnecter
});
