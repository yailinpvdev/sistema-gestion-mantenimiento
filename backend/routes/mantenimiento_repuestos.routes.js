const express = require("express");
const pool = require("../db");

const router = express.Router();

// Obtener todos los repuestos utilizados en mantenimientos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        mr.id,
        mr.mantenimiento_id,
        mr.repuesto_id,
        mr.cantidad,
        m.descripcion AS mantenimiento,
        r.nombre AS repuesto
      FROM mantenimiento_repuestos mr
      INNER JOIN mantenimientos m
        ON mr.mantenimiento_id = m.id
      INNER JOIN repuestos r
        ON mr.repuesto_id = r.id
      ORDER BY mr.id
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(
      "Error al obtener repuestos de mantenimientos:",
      error.message,
    );

    res.status(500).json({
      mensaje: "Error al obtener repuestos de mantenimientos",
    });
  }
});

// Obtener un repuesto de mantenimiento por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT
        mr.id,
        mr.mantenimiento_id,
        mr.repuesto_id,
        mr.cantidad,
        m.descripcion AS mantenimiento,
        r.nombre AS repuesto
      FROM mantenimiento_repuestos mr
      INNER JOIN mantenimientos m
        ON mr.mantenimiento_id = m.id
      INNER JOIN repuestos r
        ON mr.repuesto_id = r.id
      WHERE mr.id = $1
      `,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Registro de mantenimiento-repuesto no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener mantenimiento-repuesto:", error.message);

    res.status(500).json({
      mensaje: "Error al obtener mantenimiento-repuesto",
    });
  }
});

// Registrar un repuesto utilizado en un mantenimiento
router.post("/", async (req, res) => {
  try {
    const { mantenimiento_id, repuesto_id, cantidad } = req.body;

    const resultado = await pool.query(
      `INSERT INTO mantenimiento_repuestos
       (mantenimiento_id, repuesto_id, cantidad)
       VALUES ($1, $2, $3)
       RETURNING id, mantenimiento_id, repuesto_id, cantidad`,
      [mantenimiento_id, repuesto_id, cantidad],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(
      "Error al registrar repuesto en mantenimiento:",
      error.message,
    );

    res.status(500).json({
      mensaje: "Error al registrar repuesto en mantenimiento",
    });
  }
});

// Actualizar la cantidad de un repuesto utilizado
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const resultado = await pool.query(
      `UPDATE mantenimiento_repuestos
       SET cantidad = $1
       WHERE id = $2
       RETURNING id, mantenimiento_id, repuesto_id, cantidad`,
      [cantidad, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Registro de mantenimiento-repuesto no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(
      "Error al actualizar repuesto en mantenimiento:",
      error.message,
    );

    res.status(500).json({
      mensaje: "Error al actualizar repuesto en mantenimiento",
    });
  }
});

// Eliminar un repuesto utilizado en un mantenimiento
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `DELETE FROM mantenimiento_repuestos
       WHERE id = $1
       RETURNING id, mantenimiento_id, repuesto_id, cantidad`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Registro de mantenimiento-repuesto no encontrado",
      });
    }

    res.json({
      mensaje: "Repuesto eliminado correctamente del mantenimiento",
      registro: resultado.rows[0],
    });
  } catch (error) {
    console.error(
      "Error al eliminar repuesto del mantenimiento:",
      error.message,
    );

    res.status(500).json({
      mensaje: "Error al eliminar repuesto del mantenimiento",
    });
  }
});

module.exports = router;
