const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, equipo_id, tecnico_id, tipo, descripcion,
              fecha_mantenimiento, estado
       FROM mantenimientos
       ORDER BY id`,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener mantenimientos:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener mantenimientos",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `SELECT id, equipo_id, tecnico_id, tipo, descripcion,
              fecha_mantenimiento, estado
       FROM mantenimientos
       WHERE id = $1`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Mantenimiento no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener mantenimiento:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener mantenimiento",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { equipo_id, tecnico_id, tipo, descripcion, estado } = req.body;

    const resultado = await pool.query(
      `INSERT INTO mantenimientos
       (equipo_id, tecnico_id, tipo, descripcion, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, equipo_id, tecnico_id, tipo, descripcion,
                 fecha_mantenimiento, estado`,
      [equipo_id, tecnico_id, tipo, descripcion, estado],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear mantenimiento:", error.message);
    res.status(500).json({
      mensaje: "Error al crear mantenimiento",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { equipo_id, tecnico_id, tipo, descripcion, estado } = req.body;

    const resultado = await pool.query(
      `UPDATE mantenimientos
       SET equipo_id = $1,
           tecnico_id = $2,
           tipo = $3,
           descripcion = $4,
           estado = $5
       WHERE id = $6
       RETURNING id, equipo_id, tecnico_id, tipo, descripcion,
                 fecha_mantenimiento, estado`,
      [equipo_id, tecnico_id, tipo, descripcion, estado, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Mantenimiento no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar mantenimiento:", error.message);
    res.status(500).json({
      mensaje: "Error al actualizar mantenimiento",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `DELETE FROM mantenimientos
       WHERE id = $1
       RETURNING id`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Mantenimiento no encontrado",
      });
    }

    res.json({
      mensaje: "Mantenimiento eliminado correctamente",
      id: resultado.rows[0].id,
    });
  } catch (error) {
    console.error("Error al eliminar mantenimiento:", error.message);
    res.status(500).json({
      mensaje: "Error al eliminar mantenimiento",
    });
  }
});

module.exports = router;
