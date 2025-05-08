import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { AuthContextProvider } from "./components/authContext/AuthContextProvider";
import Calendar from "./components/Calendar/Calendar";
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
      children: [{ path: "/", element: <Calendar /> }],
    },
  ]);

  return (
    <AuthContextProvider>
      <RouterProvider router={routerLogout} />
    </AuthContextProvider>
  );
}
export default App;
