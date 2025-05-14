import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Simulation de react i18next
// Textes traduits personnalisés pour les champs du formulaire
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      // Retourne les traductions correspondants selon la clé demandée
      if (key === "register.first_name") return "Prénom";
      if (key === "register.last_name") return "Nom";
      if (key === "register.email") return "Courriel";
      if (key === "register.password") return "Mot de passe";
      return key; 
    },
    // Simulation de i18n.language 
    i18n: { changeLanguage: vi.fn(), language: "fr" },
  }),
}));

describe("Composant RegisterForm", () => {
  it("affiche les champs de saisie de l'inscription", () => {
    // On met le composant dans un BrowserRouter
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    // On vérifie que les champs avec les  traductions sont présents
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Courriel")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });
});
