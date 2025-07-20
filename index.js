import Fastify from "fastify";
import fastifyCors from '@fastify/cors';
import { dbConnect } from "./src/config/db.js";
import { taskRoutes } from "./src/routes/task.route.js";
import dotenv from "dotenv";
import { authRoute } from "./src/routes/user.route.js";
import { authenticate } from "./src/middleware/authmiddleware.js";

dotenv.config();

const app = Fastify({
  logger: true
});

// Register CORS with proper configuration
await app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Middleware pour parser le token JWT
app.decorate("authenticate", authenticate);

app.get("/", async (request, reply) => {
  return { hello: "world", message: "bienvenue sur fastify" };
});

// Connexion à la base de données
await dbConnect();

// Enregistrement des routes
app.register(taskRoutes, { prefix: "/api/v1" });
app.register(authRoute, { prefix: "/api/v1/auth" });

try {
  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      throw err;
    }
    console.log(address);
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
