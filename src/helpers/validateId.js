import mongoose from "mongoose";

// Fonction utilitaire pour valider les ObjectId MongoDB
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
