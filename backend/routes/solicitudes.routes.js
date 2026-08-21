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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `SELECT id, equipo_id, usuario_id, titulo, descripcion,
              prioridad, estado, fecha_solicitud, fecha_cierre
       FROM solicitudes
       WHERE id = $1`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Solicitud no encontrada",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener solicitud:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener solicitud",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { equipo_id, usuario_id, titulo, descripcion, prioridad, estado } =
      req.body;

    const resultado = await pool.query(
      `INSERT INTO solicitudes
       (equipo_id, usuario_id, titulo, descripcion, prioridad, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, equipo_id, usuario_id, titulo, descripcion,
                 prioridad, estado, fecha_solicitud, fecha_cierre`,
      [equipo_id, usuario_id, titulo, descripcion, prioridad, estado],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear solicitud:", error.message);
    res.status(500).json({
      mensaje: "Error al crear solicitud",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { equipo_id, usuario_id, titulo, descripcion, prioridad, estado } =
      req.body;

    const resultado = await pool.query(
      `UPDATE solicitudes
       SET equipo_id = $1,
           usuario_id = $2,
           titulo = $3,
           descripcion = $4,
           prioridad = $5,
           estado = $6
       WHERE id = $7
       RETURNING id, equipo_id, usuario_id, titulo, descripcion,
                 prioridad, estado, fecha_solicitud, fecha_cierre`,
      [equipo_id, usuario_id, titulo, descripcion, prioridad, estado, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Solicitud no encontrada",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar solicitud:", error.message);
    res.status(500).json({
      mensaje: "Error al actualizar solicitud",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `UPDATE solicitudes
       SET estado = 'cancelada'
       WHERE id = $1
       RETURNING id, equipo_id, usuario_id, titulo, descripcion,
                 prioridad, estado, fecha_solicitud, fecha_cierre`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Solicitud no encontrada",
      });
    }

    res.json({
      mensaje: "Solicitud cancelada correctamente",
      solicitud: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al cancelar solicitud:", error.message);
    res.status(500).json({
      mensaje: "Error al cancelar solicitud",
    });
  }
});

module.exports = router;
