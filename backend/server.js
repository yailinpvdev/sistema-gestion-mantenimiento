const express = require("express");
const pool = require("./db");

const app = express();

const PORT = 3000;

app.use(express.json());

const testRoutes = require("./routes/test.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const solicitudesRoutes = require("./routes/solicitudes.routes");
const equiposRoutes = require("./routes/equipos.routes");

app.use("/api/test", testRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/equipos", equiposRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "API del Sistema de Gestión de Mantenimiento funcionando",
  });
});

app.listen(PORT, () => {
  pool
    .query("SELECT NOW()")
    .then(() => console.log("PostgreSQL conectado"))
    .catch((err) => console.error("Error PostgreSQL:", err.message));

  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
