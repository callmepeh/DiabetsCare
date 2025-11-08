import { pool } from "../database.js";
import bcrypt from "bcrypt";

export const criarTabelaUsuarios = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      tipoConta VARCHAR(20) NOT NULL
    );
  `);
};

export const criarUsuario = async (nome, email, senha, tipoConta) => {
  const senhaHash = await bcrypt.hash(senha, 10);
  const result = await pool.query(
    "INSERT INTO usuarios (nome, email, senha, tipoConta) VALUES ($1, $2, $3, $4) RETURNING *",
    [nome, email, senhaHash, tipoConta]
  );
  return result.rows[0];
};

export const buscarUsuarioPorEmail = async (email) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  return result.rows[0];
};
