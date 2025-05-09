import express from "express";
import { check } from "express-validator";
import {
  inscrireUser,
  connecterUser,
} from "../controllers/users-controllers.js";

// Création d'une instance de routeur
const router = express.Router();

// Route POST : inscription d'un nouvel utilisateur
router.post(
  "/inscription",
  [
    // Validation : le nom ne doit pas être vide
    check("nom").trim().not().isEmpty().withMessage("Le nom est requis."),

    // Validation : le courriel doit être au bon format
    check("courriel").isEmail().withMessage("Courriel invalide."),

    // Validation : le mot de passe doit contenir au moins 6 caractères
    check("motDePasse")
      .isLength({ min: 6 })
      .withMessage("Minimum 6 caractères."),
  ],
  inscrireUser
);

// Route POST : connexion d’un utilisateur existant
router.post(
  "/connexion",
  [
    // Validation : le champ courriel est requis
    check("courriel").trim().not().isEmpty().withMessage("Courriel requis."),

    // Validation : le mot de passe est requis
    check("motDePasse").trim().not().isEmpty().withMessage("Mot de passe requis."),
  ],
  connecterUser
);

// Exportation du routeur pour utilisation dans app.js
export default router;
