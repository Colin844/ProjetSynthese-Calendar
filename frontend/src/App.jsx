import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./components/authContext/AuthContextProvider";

import Calendar from "./components/Calendar/Calendar";
import LoginForm from "./components/loginForm/LoginForm";
import Header from "./components/header/Header";
import EventForm from "./components/eventForm/EventForm";
import "./App.css";

function App() {
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
        { path: "/addEvent", element: <EventForm /> },
        { path: "/editEvent/:id", element: <EventForm /> },
      ],
    },
  ]);

  return (
    <AuthContextProvider>
      <RouterProvider router={routerLoggedOut} />
    </AuthContextProvider>
  );
}
export default App;
