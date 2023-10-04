import express from 'express'
import routes from './routes'
import { resolve } from 'path'
import cors from 'cors'

import './database'
class App {
    constructor() {
        this.app = express()

        const corsOptions = {
            origin: 'https://pedepede.fun', // Especifique o domínio permitido
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true, // Permite credenciais (cookies, cabeçalhos de autenticação)
          };

        this.app.use(cors(corsOptions))

        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(
            '/product-file', // Avisa qual rota vai servir os arquivos estaticos
            express.static(resolve(__dirname, '..', 'uploads')) // Procura o arquivo correspondente ao nome que geramos
        )

        this.app.use(
            '/category-file', // Avisa qual rota vai servir os arquivos estaticos
            express.static(resolve(__dirname, '..', 'uploads')) // Procura o arquivo correspondente ao nome que geramos
        )
    }

    routes() {
        this.app.use(routes)
    }
}

export default new App().app