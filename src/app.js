const express = require('express');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middlewares/errorHandler');
const setupSwaggerDocs = require('../src/docs/swagger');
const petRoutes = require('./routers/petRoutes');
const userRoutes = require('./routers/userRoutes');

const app = express();

app.use(express.json());

app.use(fileUpload());

setupSwaggerDocs(app);

app.use('/uploads', express.static('uploads'));
app.use('/api/pets', petRoutes);
app.use('/api/user', userRoutes);
app.use(errorHandler);

module.exports = app;