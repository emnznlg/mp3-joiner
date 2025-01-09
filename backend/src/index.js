require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");
const routes = require("./routes");
const { setupCleanupScheduler } = require("./utils/cleanupScheduler");

const app = express();
const port = process.env.PORT || 3000;

// CORS ayarları
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
    credentials: true,
  })
);

// Statik dosya sunumu
app.use(express.static(path.join(__dirname, "public")));

// API dokümantasyonu
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API rotaları
app.use("/api", routes);

// Geçici dosyaları temizleme
setupCleanupScheduler();

// Gerekli klasörleri oluştur
const uploadDir = path.join(process.cwd(), "uploads");
const tempDir = path.join(process.cwd(), "temp");
if (!require("fs").existsSync(uploadDir)) {
  require("fs").mkdirSync(uploadDir, { recursive: true });
}
if (!require("fs").existsSync(tempDir)) {
  require("fs").mkdirSync(tempDir, { recursive: true });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
});
