import pool from "../config/db.js";

// CREATE
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

// READ: الكل
export const getAllCategories = async () => {
  const result = await pool.query(`
    SELECT * FROM categories
    ORDER BY id
  `);
  return result.rows;
};

// READ: حسب id
export const getCategoryById = async (id) => {
  const result = await pool.query(
    `
    SELECT * FROM categories WHERE id = $1
    `,
    [id]
  );
  return result.rows[0];
};

// READ: حسب الاسم (منستخدمها نتأكد إن الاسم مش مكرر قبل الإنشاء)
export const getCategoryByName = async (name) => {
  const result = await pool.query(
    `
    SELECT * FROM categories WHERE name = $1
    `,
    [name]
  );
  return result.rows[0];
};

// DELETE
// ملاحظة: إذا الـ category فيها منتجات، PostgreSQL رح يرفض الحذف بسبب ON DELETE RESTRICT
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

// UPDATE: بيعدّل بس الحقول اللي انبعتت
export const updateCategory = async (id, name, description) => {
  const result = await pool.query(
    `
    UPDATE categories
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [name ?? null, description ?? null, id]
  );
  return result.rows[0];
};