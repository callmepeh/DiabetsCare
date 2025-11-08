import express from "express";
import { register, login, logout } from "../controllers/authController.js";

// Cria um roteador do Express para agrupar as rotas de autenticação
const roteador = express.Router();

// Rota para registro de novos usuários
// Quando uma requisição POST é feita para /auth/register,
// o controlador 'register' será executado
roteador.post("/register", register);

// Rota para autenticação (login) de usuários
// Quando uma requisição POST é feita para /auth/login,
// o controlador 'login' será executado
roteador.post("/login", login);

// Rota para logout de usuários
// Quando uma requisição POST é feita para /auth/logout,
// o controlador 'logout' será executado
roteador.post("/logout", logout);

// Exporta o roteador para ser usado no servidor principal
export default roteador;
