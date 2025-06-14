const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Micro Loan Tracker API',
      version: '1.0.0',
      description: 'API documentation for Micro Loan Tracker Backend',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'], // swagger docs from routes
};

const specs = swaggerJsDoc(options);
module.exports = specs;
