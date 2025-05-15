import { useContext } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AuthContextProvider } from "./components/authContext/AuthContextProvider";
import { AuthContext } from "./components/authContext/AuthContext";

import Calendar from "./components/Calendar/Calendar";
import LoginForm from "./components/loginForm/LoginForm";
import Header from "./components/header/Header";
import EventForm from "./components/eventForm/EventForm";
import RegisterForm from "./components/registerForm/RegisterForm";
import VueJour from "./components/vueJour/VueJour";

import "./App.css";

// Composant qui détermine quelles routes sont accessibles selon l'état de connexion
const AppRoutes = () => {
  const { isLoggedIn } = useContext(AuthContext); // Vérifie si l'utilisateur est connecté

  // Routes accessibles pour les utilisateurs NON connectés
  const routerLoggedOut = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet /> {/* Permet d'afficher les enfants selon la route */}
        </>
      ),
      children: [
        { path: "/", element: <Calendar /> },                     // Calendrier visible même non connecté
        { path: "/login", element: <LoginForm /> },               // Page de connexion
        { path: "/register", element: <RegisterForm /> },         // Page d'inscription

        // Redirection vers la connexion pour toute tentative d'accès restreint
        { path: "/addEvent", element: <Navigate to="/login" /> },
        { path: "/editEvent/:id", element: <Navigate to="/login" /> },
        { path: "/day/:date", element: <Navigate to="/login" /> },
      ],
    },
  ]);

  // Routes accessibles pour les utilisateurs CONNECTÉS
  const routerLoggedIn = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
        </>
      ),
      children: [
        { path: "/", element: <Calendar /> },                     // Calendrier principal
        { path: "/login", element: <Navigate to="/" /> },         // Empêche l'accès à /login si déjà connecté
        { path: "/register", element: <Navigate to="/" /> },      // Empêche accès à /register si déjà connecté
        { path: "/addEvent", element: <EventForm /> },            // Formulaire de création
        { path: "/editEvent/:id", element: <EventForm /> },       // Formulaire de modification
        { path: "/day/:date", element: <VueJour /> },             // Vue détaillée d'une journée
      ],
    },
  ]);

  // Retourne les routes appropriées selon l'état de connexion
  return (
    <RouterProvider router={isLoggedIn ? routerLoggedIn : routerLoggedOut} />
  );
};


const App = () => {
  return (
    // Fournit le contexte d'authentification à toute l'application
    <AuthContextProvider>
      <AppRoutes />
    </AuthContextProvider>
  );
};

export default App;
