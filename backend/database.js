import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("🟢 Banco conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error.message);
  }
};
