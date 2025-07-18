import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

export const authRoute = async (fastify) => {
  //get ALL user (Admin)
  fastify.get("/getAll/user", async (request, reply) => {
    const users = await User.find().populate("myTasks");
    return users.map((user) => ({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      myTasks: user.myTasks,
    }));
  });
  //register user
  fastify.post("/register/user", async (request, reply) => {
    const { userName, email, password } = request.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return reply.code(400).send({ error: "User exist" });
    }

    const user = new User({ userName, email, password });
    await user.save();
    return { message: "User registred successfully..." };
  });

  //login user
  fastify.post("/login/user", async (request, reply) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    return { message: "Login succesfully", token };
  });
};
