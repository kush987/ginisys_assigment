const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet API',
      version: '1.0.0',
      description: 'API for Pet use -> access token for authoize pet apis'
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local server'
      }
    ]
  },
  apis: [path.join(__dirname, '../routers/*.js')], // path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('✅ Swagger loaded. Available at /api-docs');
    console.log('📄 Loaded paths:', Object.keys(swaggerSpec.paths));
  };

module.exports = setupSwaggerDocs;
