function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  // Définir le code d'erreur par défaut 500 ou retourner le message d'erreur
  res.status(error.code || 500);
  res.json({ message: error.message || "Une erreur inconnue est survenue !" });
}

export default errorHandler;
