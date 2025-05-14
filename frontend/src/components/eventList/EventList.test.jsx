import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventList from "./EventList";
import { AuthContext } from "../authContext/AuthContext";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock react i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
         // Traductions simulées selon les clés utilisées dans EventList.jsx
      if (key === "event.none") return "Aucun événement";
      if (key === "event.upcoming") return "Événements à venir";
      return key;
    },
  }),
}));


// Contexte simulé pour tester EventList comme si un utilisateur était connecté
const Context = {
  token: "FAKE TOKEN",
  isLoggedIn: true,
};

describe("Composant EventList", () => {
  it("affiche le message 'aucun événement' si la liste est vide", () => {
    // On met le composant dans BrowserRouter et le contexte d'authentification
    render(
      <BrowserRouter>
        <AuthContext.Provider value={Context}>
          <EventList />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    
    // On s'attend à voir le texte traduit correspondant à "event.none"
    expect(screen.getByText("Aucun événement")).toBeInTheDocument();
  });
});
