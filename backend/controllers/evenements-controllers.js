import { validationResult } from "express-validator";
import Evenement from "../models/evenement.js";
import HttpError from "../util/http-error.js";
import User from "../models/user.js";

// GET /api/evenements
export const listerEvenements = async (req, res, next) => {
  try {
    const aujourdHui = new Date().toISOString().split("T")[0];
    // Supprimer tous les événements antérieurs à aujourd'hui pour cet utilisateur
    await Evenement.deleteMany({
      userId: req.user._id,
      date: { $lt: aujourdHui }, // date inférieure à aujourd'hui = événement passé
    });
    const evenements = await Evenement.find({ userId: req.user._id }).sort({
      date: 1,  // Tri ascendant par date (du plus ancien au plus récent)
    }); 
    res.status(200).json({
      evenements: evenements.map((e) => e.toObject({ getters: true })),
    });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Impossible de récupérer les événements", 500));
  }
};

// POST /api/evenements
export const ajouterEvenement = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ erreurs: errors.array() });
  }

  const { titre, description, date, heure, lieu, priorite } = req.body;
  const aujourdHui = new Date().toISOString().split("T")[0];
  if (date < aujourdHui) {
    return next(
      new HttpError("Impossible d'ajouter un événement dans le passé.", 400)
    );
  }

  try {
    // Vérifie si un événement avec le même titre et la même date existe déjà pour l'utilisateur
    const evenementExistant = await Evenement.findOne({
      userId: req.user._id,
      titre,
      date,
    });

    if (evenementExistant) {
      return next(
        new HttpError(
          "Un événement avec ce titre et cette date existe déjà",
          409
        )
      );
    }

    // Création du nouvel événement
    const nouvelEvenement = new Evenement({
      userId: req.user._id,
      titre,
      description,
      date,
      heure,
      lieu,
      priorite,
     
    });

    await nouvelEvenement.save();
    // associer l'événement à l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      $push: { evenements: nouvelEvenement._id },
    });
    res
      .status(201)
      .json({ evenement: nouvelEvenement.toObject({ getters: true }) });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Erreur lors de l'ajout de l'événement", 500));
  }
};

// PATCH /api/evenements/:id
export const modifierEvenement = async (req, res, next) => {
  const evenementId = req.params.id;
  const { titre, description, date, heure, lieu, priorite} = req.body;
  const aujourdHui = new Date().toISOString().split("T")[0];
  if (date < aujourdHui) {
    return next(
      new HttpError("Impossible d’ajouter un événement dans le passé.", 400)
    );
  }

  try {
    // Cherche l’événement par ID uniquement
    const evenement = await Evenement.findById(evenementId);

    // L'événement n'existe pas du tout
    if (!evenement) {
      return next(new HttpError("Événement introuvable", 404));
    }

    // L'événement n'appartient pas à l'utilisateur connecté
    if (!evenement.userId.equals(req.user._id)) {
      return next(
        new HttpError(
          "Accès refusé : vous n'êtes pas le propriétaire de cet événement",
          403
        )
      );
    }

    // Mise à jour seulement des champs fournis
    if (titre !== undefined) evenement.titre = titre;
    if (description !== undefined) evenement.description = description;
    if (date !== undefined) evenement.date = date;
    if (heure !== undefined) evenement.heure = heure;
    if (lieu !== undefined) evenement.lieu = lieu;
    if (priorite !== undefined) evenement.priorite = priorite;
    

    await evenement.save();
    res.status(200).json({ evenement: evenement.toObject({ getters: true }) });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Erreur lors de la mise à jour", 500));
  }
};

// DELETE /api/evenements/:id
export const supprimerEvenement = async (req, res, next) => {
  const evenementId = req.params.id;

  try {
    // Cherche l’événement par ID uniquement
    const evenement = await Evenement.findById(evenementId);

    // L'événement n'existe pas du tout
    if (!evenement) {
      return next(new HttpError("Événement introuvable", 404));
    }

    // L'événement n'appartient pas à l'utilisateur connecté
    if (!evenement.userId.equals(req.user._id)) {
      return next(
        new HttpError(
          "Accès refusé : vous ne pouvez pas supprimer cet événement",
          403
        )
      );
    }

    // Suppression de l'évènement
    await evenement.deleteOne();

    res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Erreur lors de la suppression", 500));
  }
};

// GET /api/evenements/:id
export const getEvenementById = async (req, res, next) => {
  const evenementId = req.params.id;

  try {
    const evenement = await Evenement.findById(evenementId);

    // Vérifie si l'événement existe
    if (!evenement) {
      return next(new HttpError("Événement introuvable", 404));
    }

    // Vérifie que l'événement appartient bien à l'utilisateur connecté
    if (!evenement.userId.equals(req.user._id)) {
      return next(new HttpError("Accès refusé à cet événement", 403));
    }

    // Retourne l'événement trouvé
    res.status(200).json({ evenement: evenement.toObject({ getters: true }) });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Erreur lors de la récupération", 500));
  }
};

// GET /api/evenements/date/:date
export const getEvenementsParDate = async (req, res, next) => {
  const date = req.params.date; // format  : "YYYY-MM-DD"

  try {
    // Recherche tous les événements de cette date pour l'utilisateur connecté
    const evenements = await Evenement.find({
      userId: req.user._id,
      date: date,
    }).sort({ heure: 1 }); // Tri par heure croissante dans la journée

    // Aucun évènement trouvé durant cette date
    if (evenements.length === 0) {
      return res.status(200).json({
        date,
        evenements: [],
        message: "Aucun événement trouvé pour cette date.",
      });
    }

    // Retourne la liste des événements triés pour cette date
    res.status(200).json({
      date,
      evenements: evenements.map((e) => e.toObject({ getters: true })),
    });
  } catch (err) {
    console.error(err);
    return next(
      new HttpError(
        "Erreur lors de la récupération des événements du jour",
        500
      )
    );
  }
};
