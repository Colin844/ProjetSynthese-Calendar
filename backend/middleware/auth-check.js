import jwt from "jsonwebtoken";
import HttpError from "../util/http-error.js";
import User from "../models/user.js";

const checkAuth = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    // Extraction du token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authentification échouée (token manquant) !");
    }

    // Vérification du token et décodage
    const decodedToken = jwt.verify(token, "cleSuperSecrete!");
    const userId = decodedToken.userId;

    // Vérifie que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur introuvable.");
    }

    // Ajoute l'utilisateur à la requête
    req.user = user;

    // Authorisation réussie, On continue
    next();
  } catch (err) {
    const error = new HttpError("Authentification échouée !", 401);
    return next(error);
  }
};

export default checkAuth;
