import pool from "../config/db.js";

// الأعمدة اللي بنرجّعها مع كل منتج، ومعها اسم الـ category واسم التاجر
const PRODUCT_WITH_DETAILS = `
  SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url,
         p.category_id,
         c.name AS category_name,
         p.created_by,
         u.name AS created_by_name,
         p.created_at, p.updated_at
  FROM products p
  JOIN categories c ON p.category_id = c.id
  JOIN users u      ON p.created_by  = u.id
`;

// CREATE
export const createProduct = async ({ name, description, price, stock = 0, image_url, category_id, created_by }) => {
  const result = await pool.query(
    `
    INSERT INTO products (name, description, price, stock, image_url, category_id, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [name, description, price, stock, image_url, category_id, created_by]
  );
  return result.rows[0];
};

// READ: الكل، مع JOIN
export const getAllProducts = async () => {
  const result = await pool.query(`${PRODUCT_WITH_DETAILS} ORDER BY p.id`);
  return result.rows;
};

// READ: حسب id، مع JOIN
export const getProductById = async (id) => {
  const result = await pool.query(`${PRODUCT_WITH_DETAILS} WHERE p.id = $1`, [id]);
  return result.rows[0];
};

// UPDATE
export const updateProduct = async (id, { name, description, price, stock, image_url, category_id }) => {
  const result = await pool.query(
    `
    UPDATE products
    SET name        = COALESCE($1, name),
        description = COALESCE($2, description),
        price       = COALESCE($3, price),
        stock       = COALESCE($4, stock),
        image_url   = COALESCE($5, image_url),
        category_id = COALESCE($6, category_id),
        updated_at  = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
    `,
    [name, description, price, stock, image_url, category_id, id]
  );
  return result.rows[0];
};

// DELETE
export const deleteProduct = async (id) => {
  const result = await pool.query(
    `DELETE FROM products WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};