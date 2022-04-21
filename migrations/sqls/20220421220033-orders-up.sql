CREATE TABLE orders (
    id SERIAL PRIMARY KEY NOT NULL,
    status VARCHAR(50),
    customer_id INTEGER REFERENCES customers(id)
);