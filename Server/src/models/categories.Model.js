import pool from "../config/db.js";

export const createCategory = async ({ name, description, status = "approved" }) => {
  const result = await pool.query(
    `
    INSERT INTO categories (name, status, description)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, status, description]
  );
  return result.rows[0];
};

export const getAllCategories = async () => {
  const result = await pool.query(`
    SELECT * FROM categories
  `);
  return result.rows;
};

export const getCategoryById = async (id) => {
  const result = await pool.query(
    `
    SELECT * FROM categories WHERE id = $1
    `,
    [id]
  );
  return result.rows[0];
};

export const getCategoryByName = async (name) => {
  const result = await pool.query(
    `
    SELECT * FROM categories WHERE name = $1
    `,
    [name]
  );
  return result.rows[0];
};

export const deleteCategory = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM categories WHERE id = $1
    RETURNING *
    `,
    [id]
  );
  return result.rows[0];
};

export const updateCategory = async (id, name, description) => {
  const result = await pool.query(
    `
    UPDATE categories
    SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [name, description, id]
  );
  return result.rows[0];
};