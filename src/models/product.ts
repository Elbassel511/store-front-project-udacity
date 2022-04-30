import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  stock: number;
};

export class ProductTable {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const data = await conn.query(sql);
      conn.release();
      return data.rows;
    } catch (err) {
      throw new Error(`Couldn't get products data. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't get product data. Error:${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO products (name,price,stock) VALUES ($1,$2,$3)  RETURNING * ;";
      const data = await conn.query(sql, [
        product.name,
        product.price,
        product.stock,
      ]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't create product. Error:${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM products WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't delete product. Error:${err}`);
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        "UPDATE products SET name = $2 , price = $3 , stock = $4 WHERE id = $1 RETURNING *;";
      const data = await conn.query(sql, [
        product.id,
        product.name,
        product.price,
        product.stock,
      ]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't update product. Error:${err}`);
    }
  }
}
