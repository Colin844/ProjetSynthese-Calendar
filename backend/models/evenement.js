import mongoose from "mongoose";

const evenementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  titre: { type: String, required: true },
  description: String,
  date: { type: String, required: true },
  heure: String,
   lieu: { type: String, required: true },
   priorite: {
    type: String,
    enum: ["critique", "elevee", "normale", "basse"],
    default: "normale"
  }
  
});

export default mongoose.model("Evenement", evenementSchema);
