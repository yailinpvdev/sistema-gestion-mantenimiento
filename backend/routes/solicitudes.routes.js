const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, equipo_id, usuario_id, titulo, descripcion,
              prioridad, estado, fecha_solicitud, fecha_cierre
       FROM solicitudes
       ORDER BY id`,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener solicitudes",
    });
  }
});

module.exports = router;
