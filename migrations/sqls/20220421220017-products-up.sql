CREATE TABLE products (
   id SERIAL PRIMARY KEY,
   name VARCHAR(50) NOT NULL,
   price FLOAT NOT NULL,
   stock INTEGER NOT NULL 
);