import client from "../database";

export type Customer = {
  id?: number;
  first_name: string;
  last_name?: string | undefined;
  email: string;
  password: string;
};

export class CustomerTable {
  async index(): Promise<Customer[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM customers";
      const data = await conn.query(sql);
      conn.release();
      return data.rows;
    } catch (err) {
      throw new Error(`Couldn't get customers data. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Customer> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM customers WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't get customer data. Error:${err}`);
    }
  }

  async create(customer: Customer): Promise<Customer> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO customers (first_name,last_name,password,email) VALUES ($1,$2,$3,$4) RETURNING *;";
      const data = await conn.query(sql, [
        customer.first_name,
        customer.last_name,
        customer.password,
        customer.email,
      ]);
      conn.release();
      if (!data.rows[0]) throw new Error(`couldn't create customer`);
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't create customer. Error:${err}`);
    }
  }

  async delete(id: number): Promise<Customer> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM customers WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't delete customer. Error:${err}`);
    }
  }

  async update(customer: Customer): Promise<Customer> {
    try {
      const conn = await client.connect();
      const sql = `UPDATE customers SET
         first_name = $2, 
         last_name = $3 , 
         password = $4 ,
         email = $5
         WHERE id = $1 RETURNING * `;
      const data = await conn.query(sql, [
        customer.id,
        customer.first_name,
        customer.last_name,
        customer.password,
        customer.email,
      ]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't update product. Error:${err}`);
    }
  }
  async auth(email: string): Promise<Customer> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM customers WHERE email = $1";
      const data = await conn.query(sql, [email]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't get data. Error:${err}`);
    }
  }
}
