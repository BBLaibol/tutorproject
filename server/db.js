const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tutorproject",
  password: "12345678",
  port: 5433,
});

module.exports = pool;
