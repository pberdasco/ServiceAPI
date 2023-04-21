import { config } from 'dotenv';
config();

export default {
    PORT: process.env.PORT,
    DB: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        DATABASE: process.env.DB_DATABASE,
        PORT: process.env.DB_PORT
    }
}