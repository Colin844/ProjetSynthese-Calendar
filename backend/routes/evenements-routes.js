import express from "express";
import { check, param } from "express-validator";
import checkAuth from "../middleware/auth-check.js";
import {
  listerEvenements,
  ajouterEvenement,
  modifierEvenement,
  supprimerEvenement,
  getEvenementById,
  getEvenementsParDate,
} from "../controllers/evenements-controllers.js";

// Création de l'objet routeur
const router = express.Router();

// Toutes les routes suivantes nécessitent une authentification
router.use(checkAuth);

// Route GET : liste des événements de l'utilisateur connecté
router.get("/", listerEvenements);

// Route GET : un événement spécifique par son ID
router.get(
  "/:id",
  [
    // Validation : l’ID doit être un identifiant MongoDB valide
    param("id").isMongoId().withMessage("ID invalide."),
  ],
  getEvenementById
);

// Route GET : tous les événements d’une date donnée
router.get(
  "/date/:date",
  [
    // Validation : la date doit être au format YYYY-MM-DD
    param("date")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("La date doit être au format YYYY-MM-DD."),
  ],
  getEvenementsParDate
);

// Route POST : ajouter un nouvel événement
router.post(
  "/",
  [
    // Validation : le titre ne doit pas être vide
    check("titre").not().isEmpty().withMessage("Le titre est requis."),
    // Validation : la date doit respecter le format ISO8601 (ex. 2025-05-17)
    check("date")
      .isISO8601()
      .withMessage("Le format de la date est invalide (YYYY-MM-DD)."),
    check("lieu").not().isEmpty().withMessage("Le lieu est requis."),
     check("priorite")
      .optional()
      .isIn(["critique", "elevee", "normale", "basse"])
      .withMessage("La priorité doit être critique, elevee, normale ou basse."),

  ],
  ajouterEvenement
);

// Route PATCH : modifier un événement existant
router.patch(
  "/:id",
  [
    // Validation : ID de l'événement
    param("id").isMongoId().withMessage("ID invalide."),

    // Champs optionnels à valider si présents dans la requête
    check("titre")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Le titre ne peut pas être vide."),
    check("date").optional().isISO8601().withMessage("Date invalide."),
    check("heure").optional().isString(),
    check("lieu").optional().isString().withMessage("Le lieu doit être une chaîne de caractères."),
    check("lieu")
  .optional()
  .not()
  .isEmpty()
  .withMessage("Le lieu ne peut pas être vide."), check("priorite")
      .optional()
      .isIn(["critique", "elevee", "normale", "basse"])
      .withMessage("La priorité doit être critique, elevee, normale ou basse."),

  ],
  modifierEvenement
);

// Route DELETE : supprimer un événement par ID
router.delete(
  "/:id",
  [
    // Validation : l’ID doit être un identifiant MongoDB valide
    param("id").isMongoId().withMessage("ID invalide."),
  ],
  supprimerEvenement
);

// Exportation du routeur pour l’utiliser dans app.js
export default router;
