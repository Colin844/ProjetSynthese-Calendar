import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./components/authContext/AuthContextProvider";

import Calendar from "./components/Calendar/Calendar";
import LoginForm from "./components/loginForm/LoginForm";
import Header from "./components/header/Header";
import "./App.css";

function App() {
  const routerLogout = createBrowserRouter([
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
      ],
    },
  ]);

  return (
    <AuthContextProvider>
      <RouterProvider router={routerLogout} />
    </AuthContextProvider>
  );
}
export default App;
