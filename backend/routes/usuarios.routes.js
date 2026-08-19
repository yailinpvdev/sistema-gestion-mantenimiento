const express = require("express");
const pool = require("../db");

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

module.exports = router;
