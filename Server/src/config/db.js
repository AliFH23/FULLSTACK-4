import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then((client) => {
    console.log("postgresql is connected!");
    client.release();
  })
  .catch((err) => {
    console.log("postgresql is not connected!", err.message);
  });

export default pool;