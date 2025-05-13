import { useTranslation } from "react-i18next";

// Composant pour changer la langue de l'application
export default function LanguageSwitcher() {
  const { i18n } = useTranslation(); // Accès à l'objet i18n pour gérer la langue

  // Fonction déclenchée lors du changement dans le select
  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value); // Change la langue active selon la sélection
  };

  return (
    <select
      onChange={changeLanguage}
      value={i18n.language}
      className="language-switcher"
    >
      {/* Menu déroulant pour sélectionner la langue */}
      <option value="fr">Français</option>
      <option value="en">English</option>
    </select>
  );
}
