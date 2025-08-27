// Fonction utilitaire pour gérer les erreurs
export const handleError = (error, reply) => {
  console.error(error.message);

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return reply.code(400).send({
      success: false,
      error: "Erreur de validation",
      details: errors,
    });
  }

  if (error.code === 11000) {
    return reply.code(400).send({
      success: false,
      error: "Une salle avec ce nom existe déjà",
    });
  }

  return reply.code(500).send({
    success: false,
    error: error.message,
  });
};
