import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventList from "./EventList";
import { AuthContext } from "../authContext/AuthContext";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// -------------------------------------- CONTEXTE --------------------------------------------

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


// --------------------------------- TEST UNITAIRE  -------------------------------------------


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


// ---------------------- TEST INTÉGRATION  ---------------------------------------------------


// Vérifie que deux événements simulés s'affichent dans la liste

describe("EventList avec événements simulés", () => {
  beforeEach(() => {
    // Simule une réponse contenant deux événements à venir
    global.fetch = vi.fn(() =>
      Promise.resolve({ // Cette fonction retourne une Promise résolue avec un objet simulant la réponse du serveur
      // Une Promise représente une valeur qui n'est pas encore disponible, mais qui le sera plus tard  soit avec succès, soit avec une erreur (RECHERCHE INTERNET)
        ok: true, // Indique que la réponse HTTP est réussie 
        json: () =>
          Promise.resolve({
            // Deux objets représentant des événements à venir
            evenements: [
              { id: "1", titre: "Test1", date: "2064-01-01" },
              { id: "2", titre: "Test2", date: "2012-02-15" },
            ],
          }),
      })
    );
  });

 it("affiche deux événements à venir pour un utilisateur connecté", async () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={Context}>
        <EventList />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  // Vérifie que les titres sont affichés
  expect(await screen.findByText("Test1")).toBeInTheDocument();
  expect(await screen.findByText("Test2")).toBeInTheDocument();

  // Vérifie que les dates combinées dans le texte sont présentes
  expect(await screen.findByText((text) => text.includes("2022-01-01"))).toBeInTheDocument();
  expect(await screen.findByText((text) => text.includes("2033-02-15"))).toBeInTheDocument();

  // Vérifie qu'il y a deux <li> affichés, corrspond à deux évènements listés
  const items = await screen.findAllByRole("listitem");
  expect(items).toHaveLength(2);
});
});

// ---------------------- TEST INTÉGRATION  -------------------------------------------------------------


// Vérifie que le titre principal "Événements à venir" s'affiche avec les événements

describe("Affichage du titre principal + événements", () => {
  beforeEach(() => {
    // Réutilise le même mock que ci-dessus avec deux événements
    global.fetch = vi.fn(() => 
      Promise.resolve({ // Cette fonction retourne une Promise résolue avec un objet simulant la réponse du serveur (RECHERCHE INTERNET)
        ok: true, // Indique que la réponse HTTP est réussie
        json: () =>
          Promise.resolve({
             // Deux objets représentant des événements à venir
            evenements: [
              { id: "1", titre: "1Test", date: "2044-03-10" },
              { id: "2", titre: "2Test", date: "2000-03-25" },
            ],
          }),
      })
    );
  });

it("affiche le titre principal et les événements", async () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={Context}>
        <EventList />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  const header = await screen.findByRole("heading", { level: 3 });
  expect(header).toHaveTextContent("Événements à venir");

  // Vérification des titres
  expect(await screen.findByText("1Test")).toBeInTheDocument();
  expect(await screen.findByText("2Test")).toBeInTheDocument();

  // Vérification des dates e
  expect(await screen.findByText((text) => text.includes("2089-03-10"))).toBeInTheDocument();
  expect(await screen.findByText((text) => text.includes("2077-03-25"))).toBeInTheDocument();
});
});