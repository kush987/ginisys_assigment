const app = require("./src/app");
const { PORT } =require('./src/config/env');
const sequelize = require('./src/config/sqlDatabase');

const db = require('./src/models/init');

// Synchronize the models with the database
sequelize.authenticate()
    .then(() => db.sequelize.sync({ force: true })  // Set to true to drop and recreate tables
        .then(() => {
            console.log("Database synced!");
        })
        .catch((err) => {
            console.error("Unable to sync database:", err);
        })
    )
    .then(() => {
        console.log('Database connected successfully.');

        //server start
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });