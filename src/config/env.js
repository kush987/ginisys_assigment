require('dotenv').config();

module.exports= {
    PORT: process.env.PORT || 3000,
    UPLOAD_PATH: 'uploads/',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_NAME: process.env.DB_NAME || 'pets',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASS: process.env.DB_PASS || 'password',
    DB_PORT: process.env.DB_PORT || 5432,

    ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET
};