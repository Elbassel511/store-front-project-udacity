CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    password VARCHAR(250),
    role VARCHAR(20)
);