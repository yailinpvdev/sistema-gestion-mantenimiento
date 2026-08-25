const express = require("express");
const pool = require("../db");

const router = express.Router();

// Obtener todos los repuestos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nombre, descripcion, cantidad, precio, activo, created_at
       FROM repuestos
       ORDER BY id`,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener repuestos:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener repuestos",
    });
  }
});

// Crear un repuesto
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, precio, activo } = req.body;

    const resultado = await pool.query(
      `INSERT INTO repuestos
       (nombre, descripcion, cantidad, precio, activo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, descripcion, cantidad, precio, activo, created_at`,
      [
        nombre,
        descripcion,
        cantidad,
        precio,
        activo !== undefined ? activo : true,
      ],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear repuesto:", error.message);
    res.status(500).json({
      mensaje: "Error al crear repuesto",
    });
  }
});

// Obtener un repuesto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `SELECT id, nombre, descripcion, cantidad, precio, activo, created_at
       FROM repuestos
       WHERE id = $1`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Repuesto no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener repuesto:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener repuesto",
    });
  }
});

// Actualizar un repuesto
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidad, precio, activo } = req.body;

    const resultado = await pool.query(
      `UPDATE repuestos
       SET nombre = $1,
           descripcion = $2,
           cantidad = $3,
           precio = $4,
           activo = $5
       WHERE id = $6
       RETURNING id, nombre, descripcion, cantidad, precio, activo, created_at`,
      [nombre, descripcion, cantidad, precio, activo, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Repuesto no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar repuesto:", error.message);
    res.status(500).json({
      mensaje: "Error al actualizar repuesto",
    });
  }
});

// Desactivar un repuesto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `UPDATE repuestos
       SET activo = false
       WHERE id = $1
       RETURNING id, nombre, descripcion, cantidad, precio, activo, created_at`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Repuesto no encontrado",
      });
    }

    res.json({
      mensaje: "Repuesto desactivado correctamente",
      repuesto: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al desactivar repuesto:", error.message);
    res.status(500).json({
      mensaje: "Error al desactivar repuesto",
    });
  }
});

module.exports = router;
