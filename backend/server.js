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
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  port: process.env.DATABASE_URL
    ? undefined
    : Number(process.env.DB_PORT || 5432),
});

pool
  .connect()
  .then((cliente) => {
    cliente.release();
    console.log("PostgreSQL conectado");
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

// ======================================================
// EQUIPOS
// ======================================================

// OBTENER EQUIPOS
app.get("/api/equipos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM equipos
      ORDER BY id ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener equipos:", error);

    res.status(500).json({
      mensaje: "Error al obtener los equipos",
      error: error.message,
    });
  }
});

// CREAR EQUIPO
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
    console.error("ERROR POST /api/equipos:", error);

    res.status(500).json({
      mensaje: "Error al registrar el equipo.",
      error: error.message,
    });
  }
});

// ======================================================
// SOLICITUDES
// ======================================================

// OBTENER SOLICITUDES
app.get("/api/solicitudes", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM solicitudes
      ORDER BY id ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);

    res.status(500).json({
      mensaje: "Error al obtener las solicitudes",
      error: error.message,
    });
  }
});

// CREAR SOLICITUD
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
    console.error("ERROR POST /api/solicitudes:", error);

    res.status(500).json({
      mensaje: "Error al crear la solicitud.",
      error: error.message,
    });
  }
});

// ======================================================
// MANTENIMIENTOS
// ======================================================

// OBTENER TODOS LOS MANTENIMIENTOS
app.get("/api/mantenimientos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        m.*,
        e.nombre AS equipo_nombre,
        e.tipo AS equipo_tipo,
        s.titulo AS solicitud_titulo
      FROM mantenimientos m
      INNER JOIN equipos e
        ON m.equipo_id = e.id
      LEFT JOIN solicitudes s
        ON m.solicitud_id = s.id
      ORDER BY m.id DESC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("ERROR GET /api/mantenimientos:", error);

    res.status(500).json({
      mensaje: "Error al obtener los mantenimientos.",
      error: error.message,
    });
  }
});

// OBTENER UN MANTENIMIENTO
app.get("/api/mantenimientos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT
        m.*,
        e.nombre AS equipo_nombre,
        e.tipo AS equipo_tipo,
        s.titulo AS solicitud_titulo
      FROM mantenimientos m
      INNER JOIN equipos e
        ON m.equipo_id = e.id
      LEFT JOIN solicitudes s
        ON m.solicitud_id = s.id
      WHERE m.id = $1
      `,
      [Number(id)],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Mantenimiento no encontrado.",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("ERROR GET /api/mantenimientos/:id:", error);

    res.status(500).json({
      mensaje: "Error al obtener el mantenimiento.",
      error: error.message,
    });
  }
});

// CREAR MANTENIMIENTO
app.post("/api/mantenimientos", async (req, res) => {
  try {
    const {
      equipo_id,
      solicitud_id,
      tipo,
      descripcion,
      fecha_programada,
      estado,
      observaciones,
    } = req.body;

    console.log("POST /api/mantenimientos");
    console.log("Datos recibidos:", req.body);

    if (!equipo_id || !tipo || !fecha_programada) {
      return res.status(400).json({
        mensaje:
          "El equipo, tipo de mantenimiento y fecha programada son obligatorios.",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO mantenimientos
        (
          equipo_id,
          solicitud_id,
          tipo,
          descripcion,
          fecha_programada,
          estado,
          observaciones
        )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        Number(equipo_id),
        solicitud_id ? Number(solicitud_id) : null,
        tipo,
        descripcion || null,
        fecha_programada,
        estado || "pendiente",
        observaciones || null,
      ],
    );

    console.log("Mantenimiento creado:", resultado.rows[0]);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("ERROR POST /api/mantenimientos:", error);

    res.status(500).json({
      mensaje: "Error al crear el mantenimiento.",
      error: error.message,
    });
  }
});

// ACTUALIZAR MANTENIMIENTO
app.put("/api/mantenimientos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      equipo_id,
      solicitud_id,
      tipo,
      descripcion,
      fecha_programada,
      estado,
      observaciones,
    } = req.body;

    console.log("PUT /api/mantenimientos/" + id);
    console.log("Datos recibidos:", req.body);

    if (!equipo_id || !tipo || !fecha_programada) {
      return res.status(400).json({
        mensaje:
          "El equipo, tipo de mantenimiento y fecha programada son obligatorios.",
      });
    }

    const resultado = await pool.query(
      `
      UPDATE mantenimientos
      SET
        equipo_id = $1,
        solicitud_id = $2,
        tipo = $3,
        descripcion = $4,
        fecha_programada = $5,
        estado = $6,
        observaciones = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        Number(equipo_id),
        solicitud_id ? Number(solicitud_id) : null,
        tipo,
        descripcion || null,
        fecha_programada,
        estado || "pendiente",
        observaciones || null,
        Number(id),
      ],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Mantenimiento no encontrado.",
      });
    }

    console.log("Mantenimiento actualizado:", resultado.rows[0]);

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("ERROR PUT /api/mantenimientos/:id:", error);

    res.status(500).json({
      mensaje: "Error al actualizar el mantenimiento.",
      error: error.message,
    });
  }
});

// ELIMINAR MANTENIMIENTO
app.delete("/api/mantenimientos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM mantenimientos
      WHERE id = $1
      RETURNING *
      `,
      [Number(id)],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Mantenimiento no encontrado.",
      });
    }

    console.log("Mantenimiento eliminado:", resultado.rows[0]);

    res.json({
      mensaje: "Mantenimiento eliminado correctamente.",
      mantenimiento: resultado.rows[0],
    });
  } catch (error) {
    console.error("ERROR DELETE /api/mantenimientos/:id:", error);

    res.status(500).json({
      mensaje: "Error al eliminar el mantenimiento.",
      error: error.message,
    });
  }
});

// ======================================================
// INICIAR SERVIDOR
// ======================================================

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
