import pool from "../config/db.js";

export const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
  await pool.query(
    `insert into refresh_tokens (user_id, token_hash, expires_at)
     values ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
};

// بيرجّع التوكن بس إذا موجود ولسا ما انتهى
export const findRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    `select * from refresh_tokens
     where token_hash = $1 and expires_at > now()`,
    [tokenHash]
  );
  return result.rows[0];
};

export const deleteRefreshToken = async (tokenHash) => {
  await pool.query(`delete from refresh_tokens where token_hash = $1`, [tokenHash]);
};

// بيطلّع المستخدم من كل الأجهزة
export const deleteUserRefreshTokens = async (userId) => {
  await pool.query(`delete from refresh_tokens where user_id = $1`, [userId]);
};