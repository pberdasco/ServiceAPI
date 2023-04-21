import { Router } from "express";
import {pool} from "../database/db.js";

const router = Router()

// ==== creando una ruta y testeando la conexion ... 
router.get('/ping', async(req, res) => {
    const [result] = await pool.query('SELECT 1 + 1 AS result');  // el query devuelve mas cosas, nos quedamos con el result
    res.json(result);
});

export default router;