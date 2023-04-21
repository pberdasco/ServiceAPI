import config from "./config.js";
import express from "express";
import cors from "cors";

import productoRouter from "./routers/productos_router.js";
import ping from "./routers/index_router.js";

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(cors()); // cors debe ir antes de los routers
app.use(ping); // para test en /ping 
app.use("/productos", productoRouter);

app.use((req, res, next) => res.status(404).json({message: "no existe el endpoint"}));

app.listen(config.PORT, () => console.log(`Server running http://localhost:${config.PORT}`));

