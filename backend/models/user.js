import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nom: String,
  courriel: { type: String, unique: true },
  motDePasse: String,
  langue: { type: String, default: "fr" },
  evenements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evenement" }]
});

export default mongoose.model("User", userSchema);
