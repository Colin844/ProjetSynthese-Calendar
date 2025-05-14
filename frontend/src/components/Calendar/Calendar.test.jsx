import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Calendar from "./Calendar";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock de la bibliothèque react i18next pour éviter d’utiliser les vraies traductions pendant le test
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      // Si la clé est calendar.days,on retourne les noms des jours
      if (key === "calendar.days") return ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      // Si la clé est calendar.locale, on retourne la locale française
      if (key === "calendar.locale") return "fr-FR";
    
      return key;
    },
  }),
}));

describe("Composant Calendar", () => {
  it("doit afficher le mois et l'année actuels", () => {
    // On trouve le mois et l'année actuels
    const mois = new Date().toLocaleString("fr-FR", { month: "long" });
    const annee = new Date().getFullYear();
    const attendu = `${mois} ${annee}`;

    // On met le composant dans un contexte BrowserRouter
    render(
      <BrowserRouter>
        <Calendar evenements={[]} />
      </BrowserRouter>
    );

    // Vérifie que lmois + année est bien affiché dans le composant
    // On applique toLowerCase() pour s’assurer que la casse ne bloque pas le test
    expect(screen.getByText(attendu.toLowerCase())).toBeInTheDocument();
  });
});
