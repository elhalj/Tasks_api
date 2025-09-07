import { Comments } from "../controllers/comment.controller.js";

const commentControlller = new Comments();

export const commentRoutes = async (fastify, options) => {
  // Ajouter un commentaire
  fastify.post(
    "/add/comments",
    { preHandler: fastify.authenticate },
    commentControlller.addComment
  );

  // Mettre à jour un commentaire
  fastify.put(
    "/update/comments/:commentId",
    { preHandler: fastify.authenticate },
    commentControlller.updateComment
  );

  // Supprimer un commentaire
  fastify.delete(
    "/delete/comments/:commentId",
    { preHandler: fastify.authenticate },
    commentControlller.deleteComment
  );

  // Ajouter une réponse à un commentaire
  fastify.post(
    "/reply/comments/:commentId/replies",
    { preHandler: fastify.authenticate },
    commentControlller.replyComment
  );

  // Récupérer les commentaires d'une tâche ou d'une salle
  fastify.get(
    "/get/comments",
    { preHandler: fastify.authenticate },
    commentControlller.getCommentTask
  );

  fastify.get(
    "/get/allComment",
    { preHandler: fastify.authenticate },
    commentControlller.getComment
  );

  // Ajouter/supprimer un like sur un commentaire
  fastify.post(
    "/comments/:commentId/like",
    { preHandler: fastify.authenticate },
    commentControlller.addLike
  );
};
