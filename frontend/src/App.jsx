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
import "./App.css";

const AppRoutes = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const routerLoggedOut = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
        </>
      ),
      children: [
        { path: "/", element: <Calendar /> },
        { path: "/login", element: <LoginForm /> },
        { path: "/addEvent", element: <Navigate to="/login" /> },
        { path: "/editEvent/:id", element: <Navigate to="/login" /> },
      ],
    },
  ]);

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
        { path: "/", element: <Calendar /> },
        { path: "/login", element: <Navigate to="/" /> },
        { path: "/addEvent", element: <EventForm /> },
        { path: "/editEvent/:id", element: <EventForm /> },
      ],
    },
  ]);

  return (
    <RouterProvider router={isLoggedIn ? routerLoggedIn : routerLoggedOut} />
  );
};

const App = () => {
  return (
    <AuthContextProvider>
      <AppRoutes />
    </AuthContextProvider>
  );
};

export default App;
