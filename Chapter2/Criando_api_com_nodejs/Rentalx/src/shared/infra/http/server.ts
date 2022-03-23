import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi  from "swagger-ui-express";
import "../typeorm/index";

// Import de conexão do BD.
// import "@shared/container/index"

// Import de conexão do BD.
import { createConnection } from "typeorm";

import { AppError } from "@shared/errors/AppError";
import { router } from "./routes";
import swaggerFile from "../../../swagger.json"; // Para este import precisa colocar no arquivo (tsconfig.json), a opção ("resolveJsonModule": true) desse jeito.

// Chamada da funçaõ que conecta o BD.
createConnection("localhost");

const app = express();

app.use(express.json()); // Aqui está sendo setado o express.json, para poder usar.

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile)); // Aqui está sendo setado os parametros padrão para utilização so swwager.

app.use(router); 

// Aqui foi criado essa rota para a aplicação retornar o tipo de erro padronizado, (obs: sempre trazer como 1 parametro o err, o (next) está usando a função (NextFunction), que já é padrão da propria função next, que é um middleware).  
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    return res.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
});

app.listen(8080, () => console.log('Server is running!'));


