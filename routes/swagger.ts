import express from 'express';
const router = express.Router();

const swagger_controller = require('../config/swagger.config');

router.get('/v1/swagger.json', swagger_controller.swaggerJson);
router.get('/', swagger_controller.swagger);

module.exports = router;