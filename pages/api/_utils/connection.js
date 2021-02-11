import mysql from 'mysql2/promise';

export const createConnection = () => {
  return mysql.createConnection({
    host: process.env.DB_CONN_HOST,
    port: process.env.DB_CONN_PORT,
    user: process.env.DB_CONN_USER,
    password: process.env.DB_CONN_PASSWORD,
    database: process.env.DB_CONN_DB,
  });
};
