import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../util/http-error.js";
import { validationResult } from "express-validator";

// POST /api/auth/inscription — Créer un nouvel utilisateur
export const inscrireUser = async (req, res, next) => {
  const errors = validationResult(req);
 if (!errors.isEmpty()) {
  return res.status(422).json({ erreurs: errors.array() });
}

  const { nom, courriel, motDePasse } = req.body;

  try {
    const existingUser = await User.findOne({ courriel });

    // Vérifie si le courriel est déjà utilisé
    if (existingUser) {
      return next(new HttpError("Un utilisateur avec ce courriel existe déjà", 422));
    }

    // Hachage sécurisé du mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const nouveauUser = new User({
      nom,
      courriel,
      motDePasse: hashedPassword
    });

    await nouveauUser.save();

    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Erreur lors de l'inscription", 500));
  }
};

// POST /api/auth/connexion — Connexion utilisateur
export const connecterUser = async (req, res, next) => {
  const { courriel, motDePasse } = req.body;

  try {
    const user = await User.findOne({ courriel });

    // Vérifie que le courriel existe
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    // Vérifie que le mot de passe est correct
    const isValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isValid) {
      return next(new HttpError("Mot de passe incorrect", 401));
    }

    // Génération du token JWT
    const token = jwt.sign({ userId: user._id }, "cleSuperSecrete!", {
      expiresIn: "1d"
    });

    res.status(200).json({
      token,
      userId: user._id,
      nom: user.nom
    });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Erreur lors de la connexion", 500));
  }
};
