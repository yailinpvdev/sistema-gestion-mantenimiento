const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();
const PORT = 3000;

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

// =========================
// CONEXIÓN POSTGRESQL
// =========================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// =========================
// COMPROBAR CONEXIÓN
// =========================

pool
  .connect()
  .then((cliente) => {
    console.log("PostgreSQL conectado");
    cliente.release();
  })
  .catch((error) => {
    console.error("Error conectando PostgreSQL:", error.message);
  });

// =========================
// RUTA PRINCIPAL
// =========================

app.get("/", (req, res) => {
  res.json({
    mensaje: "API del Sistema de Gestión de Mantenimiento funcionando",
  });
});

// =========================
// OBTENER EQUIPOS
// =========================

app.get("/api/equipos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM equipos
      ORDER BY id ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener equipos:", error.message);

    res.status(500).json({
      mensaje: "Error al obtener los equipos",
      error: error.message,
    });
  }
});

// =========================
// CREAR EQUIPO
// =========================

app.post("/api/equipos", async (req, res) => {
  try {
    const { nombre, tipo, marca, modelo, numero_serie, estado, ubicacion } =
      req.body;

    console.log("POST /api/equipos");
    console.log("Datos recibidos:", req.body);

    if (!nombre || !tipo) {
      return res.status(400).json({
        mensaje: "El nombre y el tipo del equipo son obligatorios.",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO equipos
        (
          nombre,
          tipo,
          marca,
          modelo,
          numero_serie,
          estado,
          ubicacion
        )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        nombre,
        tipo,
        marca || null,
        modelo || null,
        numero_serie || null,
        estado || "activo",
        ubicacion || null,
      ],
    );

    console.log("Equipo creado:", resultado.rows[0]);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("ERROR POST /api/equipos:", error.message);

    res.status(500).json({
      mensaje: "Error al registrar el equipo.",
      error: error.message,
    });
  }
});

// =========================
// OBTENER SOLICITUDES
// =========================

app.get("/api/solicitudes", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM solicitudes
      ORDER BY id ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error.message);

    res.status(500).json({
      mensaje: "Error al obtener las solicitudes",
      error: error.message,
    });
  }
});

// =========================
// CREAR SOLICITUD
// =========================

app.post("/api/solicitudes", async (req, res) => {
  try {
    const { equipo_id, usuario_id, titulo, descripcion, prioridad, estado } =
      req.body;

    console.log("POST /api/solicitudes");
    console.log("Datos recibidos:", req.body);

    if (!equipo_id || !titulo || !descripcion) {
      return res.status(400).json({
        mensaje: "El equipo, título y descripción son obligatorios.",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO solicitudes
        (
          equipo_id,
          usuario_id,
          titulo,
          descripcion,
          prioridad,
          estado
        )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        Number(equipo_id),
        usuario_id || 1,
        titulo,
        descripcion,
        prioridad || "media",
        estado || "pendiente",
      ],
    );

    console.log("Solicitud creada:", resultado.rows[0]);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("ERROR POST /api/solicitudes:", error.message);

    res.status(500).json({
      mensaje: "Error al crear la solicitud.",
      error: error.message,
    });
  }
});

// =========================
// INICIAR SERVIDOR
// =========================

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
