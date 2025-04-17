const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger_food_delivery_api.json');

module.exports = function(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
