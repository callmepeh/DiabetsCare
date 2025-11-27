/**
 * server.js
 * 
 * Servidor principal da aplicação DiabetesCare.
 * 
 * Este módulo configura e inicia o servidor Express, configurando middlewares
 * e rotas da aplicação. O servidor utiliza armazenamento em memória para
 * dados de usuários e sessões.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Cria a aplicação Express
const app = express();

// Porta em que o servidor irá rodar (padrão: 3000)
const PORTA = process.env.PORT || 3000;

// Middleware para permitir requisições de diferentes origens (CORS)
app.use(cors());

// Middleware para processar requisições com corpo em formato JSON
app.use(express.json());

// Middleware para processar cookies
app.use(cookieParser());

// Configura as rotas de autenticação no caminho /auth
app.use("/auth", authRoutes);

// Rota raiz para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.send("Servidor DiabetesCare rodando!");
});

// Inicia o servidor na porta especificada
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
