import dotenv from "dotenv";

// Charger .env
dotenv.config({ path: ".env" });

// PORT typé
export const PORT: number = Number(process.env.PORT) || 3000;


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}
export const JWT_SECRET: string = process.env.JWT_SECRET;



if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// Configuration DB typée
export const DB = {
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
};

// Construire la DATABASE_URL pour Prisma
export const DATABASE_URL = `mysql://${DB.user}:${DB.password}@${DB.host}:${DB.port}/${DB.name}`;