import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connecté à MongoDB");
  } catch (err) {
    console.error(" Erreur de connexion :", err.message);
    process.exit(1); // Arrête le serveur en cas d’échec
  }
};
