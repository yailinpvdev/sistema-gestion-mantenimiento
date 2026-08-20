const express = require("express");
const pool = require("../db");

const router = express.Router();

// Obtener todos los equipos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nombre, tipo, marca, modelo, numero_serie, estado, ubicacion, created_at
       FROM equipos
       ORDER BY id`,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener equipos:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener equipos",
    });
  }
});

// Crear un equipo
router.post("/", async (req, res) => {
  try {
    const { nombre, tipo, marca, modelo, numero_serie, estado, ubicacion } =
      req.body;

    const resultado = await pool.query(
      `INSERT INTO equipos
       (nombre, tipo, marca, modelo, numero_serie, estado, ubicacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre, tipo, marca, modelo, numero_serie, estado, ubicacion, created_at`,
      [nombre, tipo, marca, modelo, numero_serie, estado, ubicacion],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear equipo:", error.message);
    res.status(500).json({
      mensaje: "Error al crear equipo",
    });
  }
});

// Obtener un equipo por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `SELECT id, nombre, tipo, marca, modelo, numero_serie, estado, ubicacion, created_at
       FROM equipos
       WHERE id = $1`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Equipo no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener equipo:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener equipo",
    });
  }
});

// Actualizar un equipo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, marca, modelo, numero_serie, estado, ubicacion } =
      req.body;

    const resultado = await pool.query(
      `UPDATE equipos
       SET nombre = $1,
           tipo = $2,
           marca = $3,
           modelo = $4,
           numero_serie = $5,
           estado = $6,
           ubicacion = $7
       WHERE id = $8
       RETURNING id, nombre, tipo, marca, modelo, numero_serie, estado, ubicacion, created_at`,
      [nombre, tipo, marca, modelo, numero_serie, estado, ubicacion, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Equipo no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar equipo:", error.message);
    res.status(500).json({
      mensaje: "Error al actualizar equipo",
    });
  }
});

// Desactivar un equipo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `UPDATE equipos
       SET estado = 'inactivo'
       WHERE id = $1
       RETURNING id, nombre, tipo, marca, modelo, numero_serie, estado, ubicacion, created_at`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Equipo no encontrado",
      });
    }

    res.json({
      mensaje: "Equipo desactivado correctamente",
      equipo: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al desactivar equipo:", error.message);
    res.status(500).json({
      mensaje: "Error al desactivar equipo",
    });
  }
});

module.exports = router;
