const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MP3 Joiner API",
      version: "1.0.0",
      description: "MP3 dosyalarını birleştirme API dokümantasyonu",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Hata mesajı",
            },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              example: "MP3 dosyaları başarıyla birleştirildi",
            },
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  originalName: {
                    type: "string",
                    example: "song1.mp3",
                  },
                  size: {
                    type: "number",
                    description: "MB cinsinden boyut",
                    example: 5.24,
                  },
                  duration: {
                    type: "number",
                    description: "Saniye cinsinden süre",
                    example: 180,
                  },
                  bitRate: {
                    type: "number",
                    description: "kbps cinsinden bit rate",
                    example: 192,
                  },
                },
              },
            },
            result: {
              type: "object",
              properties: {
                filename: {
                  type: "string",
                  example: "1704823456789-1234.mp3",
                },
                size: {
                  type: "number",
                  description: "MB cinsinden boyut",
                  example: 8.39,
                },
                duration: {
                  type: "number",
                  description: "Saniye cinsinden süre",
                  example: 300,
                },
                bitRate: {
                  type: "number",
                  description: "kbps cinsinden bit rate",
                  example: 192,
                },
                downloadUrl: {
                  type: "string",
                  example: "/api/download/1704823456789-1234.mp3",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // routes klasöründeki tüm dosyaları tara
};

const specs = swaggerJsdoc(options);

module.exports = specs;
