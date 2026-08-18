const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const testRoutes = require("./routes/test.routes");

app.use("/api/test", testRoutes);
app.get("/", (req, res) => {
  res.json({
    mensaje: "API del Sistema de Gestión de Mantenimiento funcionando",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
