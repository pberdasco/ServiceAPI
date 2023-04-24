import { config } from 'dotenv';
config();

//atención si las variables estuvieran definidas en .env con = en lugar de : aqui habria que usar = también 
export default {
    PORT: process.env.PORT,
    DB: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        DATABASE: process.env.DB_DATABASE,
        PORT: process.env.DB_PORT
    },
    LOGREQUEST: process.env.LOG_REQUEST,
    LOGERRORS: process.env.LOG_ERRORS,
    JWT_SECRET: process.env.JWT_SECRET
}