const express = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nombre, correo, rol, activo, created_at FROM usuarios ORDER BY id",
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, rol, activo, created_at`,
      [nombre, correo, passwordEncriptada, rol],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({
      mensaje: "Error al crear usuario",
    });
  }
});

module.exports = router;
