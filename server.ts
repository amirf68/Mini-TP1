import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";

const coreStudents = ["Ali", "Asemaneh", "Farnoush", "Nasim", "Diba", "Fatemeh", "Iliya", "Azadeh", "Narin"];

interface StudentState {
  name: string;
  isOnline: boolean;
  score: number; // for games
  answers: Record<number, any>;
  hasAnsweredCurrent: boolean;
  isGuest: boolean;
}

let currentSlide = 1;
const students: Record<string, StudentState> = {};

// Pre-populate core students as offline
coreStudents.forEach(name => {
  students[name] = { name, isOnline: false, score: 0, answers: {}, hasAnsweredCurrent: false, isGuest: false };
});

const teacherRoles: Record<string, boolean> = {}; // socketId -> isTeacher

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    // console.log("New client connected", socket.id);

    socket.on("join", (data) => {
      if (data.role === "teacher") {
        teacherRoles[socket.id] = true;
        socket.join("teachers");
        socket.join("session");
      } else {
        const name = data.name;
        if (name) {
          socket.join("session");
          if (!students[name]) {
            // New user, possibly a guest if not in core (core are pre-populated)
            const isGuest = !coreStudents.includes(name);
            students[name] = { name, isOnline: true, score: 0, answers: {}, hasAnsweredCurrent: false, isGuest };
          } else {
            students[name].isOnline = true;
          }
          socket.data.name = name;
        }
      }
      
      // Broadcast state
      io.to("session").emit("stateUpdate", {
        currentSlide,
        students: Object.values(students)
      });
    });

    socket.on("setSlide", (slideNumber) => {
      if (teacherRoles[socket.id]) {
        currentSlide = slideNumber;
        Object.values(students).forEach(s => s.hasAnsweredCurrent = false);
        io.to("session").emit("stateUpdate", {
          currentSlide,
          students: Object.values(students)
        });
      }
    });

    socket.on("triggerEvent", ({ eventName, payload }) => {
      if (teacherRoles[socket.id]) {
        io.to("session").emit("roomEvent", { eventName, payload });
      }
    });

    socket.on("submitAnswer", (answerData) => {
      const name = socket.data.name;
      if (name && students[name]) {
        students[name].answers[currentSlide] = answerData;
        students[name].hasAnsweredCurrent = true;
        
        // Give some points for participation! Gamification.
        students[name].score += 10;
        
        io.to("session").emit("stateUpdate", {
          currentSlide,
          students: Object.values(students)
        });
      }
    });

    socket.on("disconnect", () => {
      if (teacherRoles[socket.id]) {
        delete teacherRoles[socket.id];
      } else if (socket.data.name) {
        const name = socket.data.name;
        if (students[name]) {
          students[name].isOnline = false;
        }
        io.to("session").emit("stateUpdate", {
          currentSlide,
          students: Object.values(students)
        });
      }
    });
  });

  // API route to get core students for suggestions
  app.get("/api/core-students", (req, res) => {
    res.json(coreStudents);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
