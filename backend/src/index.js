const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./utils/swagger");
const cleanupScheduler = require("./utils/cleanupScheduler");
const routes = require("./routes");

const app = express();

// CORS yapılandırması
const corsOptions = {
  origin: function (origin, callback) {
    // Geliştirme ortamında tüm originlere izin ver
    // Production ortamında bu kısmı güvenlik gereksinimlerine göre düzenle
    callback(null, true);
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // CORS önbellek süresi (24 saat)
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "MP3 Joiner API Documentation",
  })
);

// Routes
app.use("/api", routes);

// Dosya temizleme mekanizmasını başlat
cleanupScheduler.start();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
