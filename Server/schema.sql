DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(200) NOT NULL,
  email           VARCHAR(150) UNIQUE NOT NULL,
  hashed_password VARCHAR(200) NOT NULL,
  role            VARCHAR(20) NOT NULL DEFAULT 'user'
                  CHECK (role IN ('admin', 'user', 'trader')),
  status          VARCHAR(20) NOT NULL DEFAULT 'approved'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(30) NOT NULL UNIQUE,
  description TEXT,
  is_archived BOOLEAN DEFAULT true,
  status      VARCHAR(20) NOT NULL DEFAULT 'approved'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL,
  stock       INTEGER DEFAULT 0,
  image_url   TEXT,
  category_id INTEGER NOT NULL,
  created_by  INTEGER NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by)  REFERENCES users(id)      ON DELETE CASCADE
);