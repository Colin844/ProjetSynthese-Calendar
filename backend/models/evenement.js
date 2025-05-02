import mongoose from "mongoose";

const evenementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  titre: { type: String, required: true },
  description: String,
  date: { type: String, required: true },
  heure: String,
  complete: { type: Boolean, default: false }
});

export default mongoose.model("Evenement", evenementSchema);
