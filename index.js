import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server as Io } from "socket.io";
import { dbConnect } from "./src/config/db.js";
import { taskRoutes } from "./src/routes/task.route.js";
import dotenv from "dotenv";
import { authRoute } from "./src/routes/user.route.js";
import { authenticate } from "./src/middleware/authmiddleware.js";

dotenv.config();

const app = Fastify({
  logger: true,
});

// Middleware pour parser le token JWT
app.decorate("authenticate", authenticate);

async function startServer() {
  try {
    // Register CORS
    await app.register(fastifyCors, {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    // Connect to database
    await dbConnect();

    // Initialize Socket.IO AVANT les routes
    const io = new Io(app.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    // Authentification des sockets
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (token) {
          // Vérifier le token ici
          const user = await authenticate(token);
          socket.userId = user.id;
          socket.join(`user_${user.id}`); // Rejoindre une room personnelle
        }
        next();
      } catch (err) {
        console.log("Socket auth failed:", err.message);
        next(); // Permettre les connexions non authentifiées pour certains cas
      }
    });

    // Décorer Fastify avec io pour l'utiliser dans les routes
    app.decorate("io", io);

    // Socket.IO events
    io.on("connection", (socket) => {
      console.log(`New client connected: ${socket.id}`);

      // Si l'utilisateur est authentifié, joindre sa room personnelle
      if (socket.userId) {
        socket.join(`user_${socket.userId}`);
        console.log(`User ${socket.userId} joined personal room`);

        // Émettre les tâches existantes à la connexion
        socket.emit("connected", {
          message: "Connexion établie",
          userId: socket.userId,
          timestamp: new Date(),
        });
      }

      // Événements personnalisés
      socket.on("joinTaskRoom", (taskId) => {
        socket.join(`task_${taskId}`);
        console.log(`Socket ${socket.id} joined task room: ${taskId}`);
      });

      socket.on("leaveTaskRoom", (taskId) => {
        socket.leave(`task_${taskId}`);
        console.log(`Socket ${socket.id} left task room: ${taskId}`);
      });

      // Gestion des statuts en ligne
      socket.on("userOnline", () => {
        if (socket.userId) {
          socket.broadcast.emit("userStatusChanged", {
            userId: socket.userId,
            status: "online",
          });
        }
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        if (socket.userId) {
          socket.broadcast.emit("userStatusChanged", {
            userId: socket.userId,
            us: "offline",
          });
        }
      });
    });

    // Register routes APRÈS Socket.IO
    await app.register(taskRoutes, { prefix: "/api/v1" });
    await app.register(authRoute, { prefix: "/api/v1/auth" });

    // Routes pour les notifications en temps réel
    app.post("/api/v1/broadcast", async (request, reply) => {
      const { event, data, room } = request.body;

      if (room) {
        io.to(room).emit(event, data);
      } else {
        io.emit(event, data);
      }

      return reply.send({ success: true });
    });

    // Route pour notification à un utilisateur spécifique
    app.post("/api/v1/notify-user", async (request, reply) => {
      const { userId, event, data } = request.body;

      io.to(`user_${userId}`).emit(event, data);

      return reply.send({ success: true });
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO ready for real-time connections`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();
