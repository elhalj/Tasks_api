import jwt from "jsonwebtoken";

export const authenticate = (request, reply, next) => {
  let token;
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(403).send({ error: "Unauthorize token" });
    }
    token = authHeader.split(" ")[1];
    if (!token) {
      return reply.code(403).send({ error: "Unauthorize token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch (error) {
    reply.code(401).send({ error: "Invalid token" });
  }
};
