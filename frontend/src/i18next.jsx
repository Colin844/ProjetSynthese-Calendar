import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";


i18n
  .use(Backend) // Utilise le backend pour charger les fichiers de traduction
  .use(LanguageDetector) // Utilise le détecteur de langue pour détecter automatiquement la langue préférée
  .use(initReactI18next) // Connecte i18n à React
  .init({
    lng: "fr", // Définit la langue par défaut sur le français
    fallbackLng: "en", // Si une traduction est manquante en français, utilise l'anglais comme langue de secours
    debug: false, // Active/désactive les logs de débogage dans la console

    interpolation: {
      escapeValue: false, // Désactive l’échappement des caractères spéciaux (inutile avec React car il échappe déjà)
    },

    supportedLngs: ["fr", "en"], // Langues prises en charge par l'application
    load: "languageOnly", // n’utiliser que la portion langue du navigateur.
  });

// Met à jour dynamiquement l'attribut lang du HTML (<html lang="fr"> ou <html lang="en">)
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

// Exporte la configuration pour l'utiliser ailleurs (ex: dans index.js)
export default i18n;
