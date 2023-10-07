import express from "express";
import routes from "./routes";
import { resolve } from "path";
import cors from "cors";

import "./database";
class App {
    constructor() {
        this.app = express();

        // Configuração do CORS para permitir solicitações do domínio do frontend
        app.use(
            cors({
                origin: "https://pedepede.fun", // Substitua pelo domínio correto do seu frontend
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                credentials: true, // Permite credenciais (cookies, cabeçalhos de autenticação)
            })
        );

       // this.app.use(cors(corsOptions));

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(
            "/product-file", // Avisa qual rota vai servir os arquivos estaticos
            express.static(resolve(__dirname, "..", "uploads")) // Procura o arquivo correspondente ao nome que geramos
        );

        this.app.use(
            "/category-file", // Avisa qual rota vai servir os arquivos estaticos
            express.static(resolve(__dirname, "..", "uploads")) // Procura o arquivo correspondente ao nome que geramos
        );
    }

    routes() {
        this.app.use(routes);
    }
}

export default new App().app;
