import { UserController } from "../controllers/user.controller.js";

const userController = new UserController();
export const authRoute = async (fastify) => {
  //get ALL user (Admin)
  fastify.get("/user", userController.getUser);

  fastify.get("/user/:profileId", userController.getUserById);
  //register user
  fastify.post("/register/user", userController.register);

  //login user
  fastify.post("/login/user", userController.login);

  //Update profile
  fastify.put(
    "/update/profile/:profileId",
    { preHandler: fastify.authenticate },
    userController.update
  );

  // Update preference
  fastify.put(
    "/update/preference/:profileId",
    { preHandler: fastify.authenticate },
    userController.updatePreference
  );
};
