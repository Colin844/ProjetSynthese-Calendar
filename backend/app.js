// express et mongoose
import express from "express";
import { connectDB } from "./util/bd.js";

import userRoutes from "./routes/users-routes.js";
import evenementRoutes from "./routes/evenements-routes.js";
import errorHandler from "./handlers/errorHandler.js";

// Création de l'application Express
const app = express();

// Lire les variables d'environnement
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://yuandietrichko:UamjW7cQGg4dVZ16@cal3nd4r.hzoivfl.mongodb.net/?retryWrites=true&w=majority&appName=Cal3nd4r";

// Connexion à MongoDB
await connectDB(MONGODB_URI);

// Middleware JSON
app.use(express.json());

// Configuration CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Déclaration des routes
app.use("/api/users", userRoutes);
app.use("/api/evenements", evenementRoutes);

// Middleware pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: "Route introuvable" });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur + Connexion BD
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
