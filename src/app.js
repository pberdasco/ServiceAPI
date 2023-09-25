import config from "./config.js";
import express from "express";
import cors from "cors";

import {productoRouter} from "./routers/productos_router.js";
import {casoRouter} from "./routers/casos_routers.js";
import {authRouter} from "./routers/auth_routers.js";
import ping from "./routers/index_router.js";
import { estadoCabRouter } from "./routers/estadoCab_routers.js";
import { estadoItemRouter } from "./routers/estadoItem_routers.js";
import { statusDatosRouter } from "./routers/statusDatos_routers.js";
import { uploadsRouter } from "./routers/uploads_router.js";

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(cors()); // cors debe ir antes de los routers

app.use(ping); // para test en /ping 
app.use("/casos", casoRouter);
app.use("/productos", productoRouter);
app.use("/auth", authRouter);
app.use("/estadoCab", estadoCabRouter);
app.use("/estadoItem", estadoItemRouter);
app.use("/statusDatos", statusDatosRouter);
app.use("/upload", uploadsRouter);

app.use((req, res, next) => res.status(404).json({message: "no existe el endpoint"}));

app.listen(config.PORT, () => console.log(`Server running http://localhost:${config.PORT}`));

